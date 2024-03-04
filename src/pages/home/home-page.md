# Home page

```mermaid
flowchart LR

  homePage[Home Page] --> Components
  homePage --> APILayer
  homePage --> prepareFilters
  homePage --> Events

  subgraph Components
      direction TB
      pagination[Pagination]
      sideBar[SideBar]
      card[Card]
      cardsList[CardsList]
      search[Search]
  end

  subgraph APILayer
      direction TB
      getProducts
      getCategories
      getBrands
  end

  prepareFilters[Prepare Filters]

  subgraph Events
    newLines["`
    Line1
    Line 2
    Line 3`"]
  end
```
