# Flow diagram

```mermaid
flowchart LR
    user((Browser)) ==> Index[index.js]

    Index ==> App[App.js]
    style Index fill:green


    App ==> Router[router.js]
    style App fill:green

    Router ==> RenderPage[render-page.js]
    style Router fill:green

    RenderPage ==> HomePage ==> APILayer
    style RenderPage fill:green

    RenderPage --> LoginPage --> APILayer
    RenderPage --> CreateProductPage --> APILayer
    RenderPage --> PaymentPage --> APILayer
    RenderPage --> 404


    subgraph lazyLoading
       direction TB

       HomePage
       style HomePage fill:green

       LoginPage
       CreateProductPage
       PaymentPage
       404
    end

    subgraph "API Layer"
       direction LR
       APILayer[[API Layer]]
       style APILayer fill:green
    end

    subgraph Backend
        style Backend fill:green
        direction LR
    end

    APILayer ==> Backend

    linkStyle 0,1,2,3,4,5,13 stroke:orange,stroke-width:2px
```
