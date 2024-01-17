import { useSession } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PageHeader from '@/routes/_app/-components/page-header'
import { FileRoute } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'

export const Route = new FileRoute('/_app/exercises').createRoute({
  component: App,
})

function App() {
  const session = useSession()

  return (
    <div>
      <PageHeader
        title="Exercises"
        actions={
          <Button variant="link" className="p-0 text-secondary">
            New
          </Button>
        }
      >
        <div className="container py-1 mx-auto space-y-2">
          <div className="relative">
            <SearchIcon className="absolute size-4 text-muted-foreground top-3 left-3" />
            <Input type="text" placeholder="search" className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PageHeader>
      <div className="container pt-2">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure praesentium itaque
        quo omnis atque alias quae explicabo debitis saepe consequatur excepturi et sit
        officiis sunt ad nesciunt modi est ratione, dolorum accusantium. Omnis enim
        asperiores, ratione commodi sapiente eaque sit, nesciunt fugiat laboriosam
        corporis ex cupiditate iusto cum est aliquam explicabo, libero deserunt. Quos ut
        nihil perspiciatis eligendi quas. Tempore, id tempora, nobis voluptatum itaque
        alias dolorum at laborum quaerat non hic. Nam minima quaerat asperiores accusamus
        veritatis quos in, tempore blanditiis ipsam eos, sint reprehenderit. Minima alias
        non, et doloremque, facilis excepturi modi nesciunt quos porro ratione quibusdam!
        Beatae nulla eveniet maiores dolorum delectus, praesentium commodi a fugiat,
        explicabo eaque quaerat corrupti est, omnis reiciendis in tempore. Quisquam
        excepturi quidem sit ad cupiditate, culpa ipsa possimus debitis beatae facilis
        nostrum eum rerum odit incidunt ratione commodi modi rem est iste aperiam
        laudantium voluptatum, dolor repudiandae? Aperiam asperiores nisi quo, expedita
        assumenda corrupti possimus quas voluptates iste sed sapiente officia blanditiis
        dolores consequatur dignissimos laudantium ab magnam eum. Accusamus modi rerum
        tenetur ea? Delectus a consequatur quas fugit. Temporibus, aspernatur quae?
        Quibusdam tempora voluptate suscipit sint fugit nemo nostrum, magni nesciunt
        accusantium! Et totam aut repellendus dignissimos unde dolor distinctio ipsam
        aperiam quisquam, numquam debitis aliquam reprehenderit architecto voluptatibus
        quia assumenda perspiciatis fuga magnam iusto, culpa expedita doloremque. Ipsa
        est, reprehenderit corrupti ut optio similique ex. Beatae inventore mollitia illum
        quasi quod? Quos, voluptatem. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum, saepe cumque. Pariatur vitae maiores culpa? Iste omnis, nihil repudiandae aliquid enim eligendi reprehenderit sit soluta ipsam. Magni, ipsa facere voluptatum facilis quis iusto soluta odio fugit aliquid, a optio reiciendis mollitia molestias. Itaque natus debitis ad, corporis cum ducimus molestias, repudiandae dolor neque deleniti nemo. Illum itaque nihil voluptates nulla vel? Facilis, fugiat optio. Illum ipsam minima ducimus magni iure voluptate, aperiam animi nisi officiis dignissimos ratione totam culpa maiores labore amet a dolor blanditiis voluptatem accusamus ut modi enim numquam. Commodi deserunt quibusdam facilis voluptatum perferendis dolorum soluta beatae quaerat blanditiis aut magni quia veritatis eos facere eligendi incidunt necessitatibus provident inventore, explicabo exercitationem totam esse hic optio. Accusantium voluptatibus dolorem nulla illo, praesentium facilis itaque, architecto, fugit saepe est aliquid culpa necessitatibus eos neque corporis odio recusandae exercitationem eligendi quam! Et fugit doloribus veniam ipsum eligendi officia totam ea eius quo, dolores soluta harum facilis quaerat quia ab ratione, exercitationem voluptate odit expedita amet distinctio animi quae quas illum. Mollitia fugiat accusantium sed eos voluptatum repellendus ab deserunt quia ducimus quam placeat excepturi nobis labore doloremque reprehenderit tempore, cupiditate autem quisquam corporis. Dicta illum, inventore ratione quam rerum repellat ad porro commodi excepturi natus id neque reiciendis sunt culpa? Veniam neque tempora soluta esse blanditiis! In, voluptatum corrupti? Non, repellendus ab, magni nulla quam enim unde similique inventore placeat magnam earum amet.
      </div>
    </div>
  )
}
