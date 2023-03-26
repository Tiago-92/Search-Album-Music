import './styles.css'
interface CardProps {
    name: string
    img: string
  }

export function Card({ name, img }: CardProps) {
  return (
    <div className="container">
      <p>{name}</p>
      <img src={img} />
    </div>
  )
}