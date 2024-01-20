import { useSession } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import PageHeader from '@/routes/-components/page-header'
import { FileRoute } from '@tanstack/react-router'

export const Route = new FileRoute('/_app/').createRoute({
  component: App,
})

function App() {
  const session = useSession()

  return (
    <div>
      <PageHeader
        title="Start a Workout"
        actions={
          <Button variant="link" className="p-0 text-sky-600">
            New
          </Button>
        }
      />
      <div className="container">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab recusandae architecto
        ipsa animi? Ipsa, soluta architecto maiores adipisci ullam enim officia modi. Eos
        fugiat natus maiores quasi unde assumenda accusantium quo illo, tempora sit quae
        placeat obcaecati delectus dicta voluptates fuga consequuntur! Tempora architecto
        a obcaecati nihil nisi, delectus iure blanditiis adipisci amet est consequatur
        distinctio accusantium perspiciatis excepturi facere. Ipsum corporis, aliquid at
        soluta quis repellat officia? Quos, culpa. Dolor a, sunt, possimus veniam ut
        laborum voluptas nihil debitis corrupti voluptatum commodi molestias explicabo
        repudiandae. Placeat fugiat atque ut odio suscipit repudiandae ex debitis,
        sapiente mollitia esse eligendi reiciendis reprehenderit quia dolore impedit dicta
        earum veniam totam. Alias ea fugit quidem a nam tempora, qui totam! Error eos
        magnam ipsum placeat quaerat possimus velit omnis inventore laudantium, laborum
        rerum ea doloribus nostrum suscipit accusamus delectus labore quis veritatis. Ab
        suscipit, sapiente eum ducimus veniam quasi! Voluptatem tempora voluptate magnam
        omnis blanditiis facere, mollitia assumenda, molestiae atque laudantium quia.
        Consequuntur, ipsum! Quisquam reiciendis quaerat voluptatem debitis corrupti
        perspiciatis adipisci eaque ratione sint amet praesentium porro aut deserunt, cum
        explicabo pariatur quasi sapiente voluptatibus fuga dolor ipsum. Architecto sunt
        magni suscipit odit, unde optio rerum, laudantium ex molestias mollitia commodi
        ipsa officia soluta alias fuga et eos. Dolor recusandae enim quas eum, harum vel
        eos! Blanditiis deserunt eveniet mollitia hic adipisci enim ad, molestiae nam
        expedita minima labore autem error maxime aperiam delectus minus debitis sunt
        voluptatum fugiat. Aspernatur nam et porro earum. Accusamus quas aperiam nostrum
        aut nam deserunt mollitia necessitatibus aliquam, incidunt aspernatur corporis
        molestias, sint provident sit harum in perspiciatis, molestiae ea. Tenetur
        cupiditate aliquid aut veritatis, laboriosam sed rem soluta sit vitae praesentium
        saepe quas exercitationem. Dicta necessitatibus, facere obcaecati nobis dolorum
        suscipit commodi, accusamus dolorem, distinctio perspiciatis ab consectetur fugiat
        dolor? Atque vel autem perferendis harum architecto amet, accusamus voluptas
        tempora soluta quas, in deleniti ullam libero quia obcaecati repellat assumenda
        provident quis impedit molestias! Veniam quis sunt quibusdam omnis eius!
        Recusandae non placeat delectus ex dicta ut at! Harum dolor tempora dignissimos
        tenetur esse eveniet quidem reprehenderit totam quas modi?
      </div>
    </div>
  )
}
