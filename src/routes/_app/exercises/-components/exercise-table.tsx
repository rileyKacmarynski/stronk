import { exercisesQueries } from "@/routes/_app/exercises/-queries";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useInView, AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect, Fragment } from "react";
import SkeletonLoader from "./skeleton-loader";

const api = getRouteApi('/_app/exercises')

export default function ExerciseTable() {
  const search = api.useSearch();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(exercisesQueries.list(search));
  const queryRef = useRef<HTMLLIElement>(null);
  const isInView = useInView(queryRef);

  useEffect(() => {
    if (hasNextPage && isInView) {
      fetchNextPage();
    }
  }, [isInView]);

  // const items = data?.pages
  //   .flatMap((g) => g.data?.map((e) => e))
  //   .filter((e) => e !== undefined)
  // should use virtuoso here, but then I have to redo the layout
  return (
    <ul className="h-full">
      {/* <Virtuoso
              className="h-full"
              data={items}
              itemContent={(_i, exercise) => (
                <li className="py-2 border-b last:border-b-0 border-border" key={exercise.id}>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {exercise.title}{' '}
                      {exercise.required_equipment ? `(${exercise.equipment?.name})` : ''}
                    </p>
                    <div className="flex text-sm font-medium text-muted-foreground">
                      <p className="">
                        {exercise.muscle_groups?.name} • {exercise.exercise_types?.type}
                      </p>
                    </div>
                  </div>
                </li>
              )}
            /> */}
      {data?.pages.map((group, i) => (
        <Fragment key={i}>
          {group.data?.map((exercise) => (
            <li className="py-2 border-b last:border-b-0 border-border" key={exercise.id}>
              <div className="space-y-1">
                <p className="font-medium">
                  {exercise.title}{' '}
                  {exercise.required_equipment ? `(${exercise.equipment?.name})` : ''}
                </p>
                <div className="flex text-sm font-medium text-muted-foreground">
                  <p className="">
                    {exercise.muscle_groups?.name} • {exercise.exercise_types?.type}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </Fragment>
      ))}
      <li ref={queryRef}>
        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLoader count={1} />
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </ul>
  );
}
