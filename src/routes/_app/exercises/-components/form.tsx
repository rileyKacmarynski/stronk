import { Combobox } from "@/components/ui/combobox";
import DebouncedInput from "@/components/ui/debounced-input";
import { equipmentQueries, exerciseTypeQueries, muscleGroupsQueries } from "@/routes/_app/exercises/-queries";
import { ExerciseSearch } from "@/routes/_app/exercises/route";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

const api = getRouteApi('/_app/exercises')

export default function Form() {
  const search = api.useSearch();
  const equipmentQuery = useQuery(equipmentQueries.equipment());
  const typesQuery = useQuery(exerciseTypeQueries.types());
  const groupsQuery = useQuery(muscleGroupsQueries.muscleGroups());

  const navigate = useNavigate();

  function handleSubmit(formSearch: Partial<ExerciseSearch>) {
    const newSearch = {
      ...search,
      ...formSearch,
    };
    // don't include empty values
    for (const key in newSearch) {
      const value = newSearch[key as keyof ExerciseSearch];
      if (!value || value?.trim() === '') {
        delete newSearch[key as keyof ExerciseSearch];
      }
    }

    navigate({ search: newSearch });
  }

  // this whole form with hidden inputs isn't my favorite
  // I want the user to be able to submit the form by hitting enter
  // maybe I won't need that functionality when I have the tranition piece working
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const search = Object.fromEntries(data);
        return handleSubmit(search);
      }}
    >
      <input type="hidden" name="type" value={search.type ?? ''} />
      <input type="hidden" name="equipment" value={search.equipment ?? ''} />
      <input type="hidden" name="group" value={search.group ?? ''} />
      <div className="container mx-auto space-y-2">
        <div className="relative">
          <SearchIcon className="absolute size-5 text-muted-foreground top-3 left-3" />
          <DebouncedInput
            type="text"
            defaultValue={search.q ?? ''}
            name="q"
            onChange={(value) => {
              handleSubmit({
                q: value === '' ? undefined : value,
              });
            }}
            placeholder="search"
            className="pl-10" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Combobox
            value={search.type}
            items={typesQuery.data?.map((type) => ({
              label: type.type ?? '',
              value: type.id,
            })) ?? []}
            onValueChange={(type) => {
              return handleSubmit({ type });
            }}
            placeholder="Select type"
            emptyText="No type found."
            isLoading={typesQuery.isLoading} />
          <Combobox
            value={search.group}
            items={groupsQuery.data?.map((group) => ({
              label: group.name ?? '',
              value: group.id,
            })) ?? []}
            onValueChange={(group) => {
              return handleSubmit({ group });
            }}
            placeholder="Select group"
            emptyText="No group found."
            isLoading={groupsQuery.isLoading} />
          <Combobox
            value={search.equipment}
            items={equipmentQuery.data?.map((equipment) => ({
              label: equipment.name ?? '',
              value: equipment.id,
            })) ?? []}
            onValueChange={(equipment) => {
              return handleSubmit({ equipment });
            }}
            placeholder="Select equpment"
            emptyText="No equipment found."
            isLoading={equipmentQuery.isLoading} />
        </div>
      </div>
    </form>
  )
}
