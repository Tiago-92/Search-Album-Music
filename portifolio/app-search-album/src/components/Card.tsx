interface CardProps {
    name: string
    img: string
  }

export function Card({ name, img }: CardProps) {
  return (
    <>
      <p>{name}</p>
      <img src={img} />
    </>
  )
}