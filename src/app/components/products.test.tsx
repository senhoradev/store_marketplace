import { render, screen } from "@testing-library/react"
import {ProductGrid} from "./products"

const vehiclesMock = [
  {
    id: 1,
    title: "Fiat Marea",
    bodyType: "Sedan"
  },
  {
    id: 2,
    title: "Gol G4",
    bodyType: "Hatch"
  }
]

describe("ProductGrid", () => {
  it("should render vehicles", () => {
    render(<ProductGrid vehicles={vehiclesMock} />)

    expect(screen.getByText("Fiat Marea")).toBeInTheDocument()
    expect(screen.getByText("Gol G4")).toBeInTheDocument()
  })

  it("should render empty state", () => {
    render(<ProductGrid vehicles={[]} />)

    expect(
      screen.getByText(/não temos esse modelo/i)
    ).toBeInTheDocument()
  })

  it("should render correct links", () => {
    render(<ProductGrid vehicles={vehiclesMock} />)

    const links = screen.getAllByRole("link")

    expect(links[0]).toHaveAttribute("href", "#produto/1")
    expect(links[1]).toHaveAttribute("href", "#produto/2")
  })
})