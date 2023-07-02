import _ from 'lodash'
type route = {
  [titleName:string] : routeContent
}

type routeContent = {
  text:string
    children:routeChildren[]
}

type routeChildren = {
    link:string
  text:string
}

const components:route = {
  "basic": {
    "text": "Basic",
    "children": [
      {
        "link": "/dayjs",
        "text": "dayjs"
      },
      {
        "link": "/downLoad",
        "text": "downLoad"
      },
      {
        "link": "/flattenObject",
        "text": "flattenObject"
      },
      {
        "link": "/image",
        "text": "image"
      },
      {
        "link": "/multipartform-data",
        "text": "multipartform-data"
      },
      {
        "link": "/qs",
        "text": "qs"
      },
      {
        "link": "/dayjs",
        "text": "dayjs"
      },
      {
        "link": "/sortablejs",
        "text": "sortablejs"
      },

    /*  {
        "link": "/border",
        "text": "Border"
      },
      {
        "link": "/color",
        "text": "Color"
      },
      {
        "link": "/container",
        "text": "Layout Container"
      },
      {
        "link": "/icon",
        "text": "Icon"
      },
      {
        "link": "/layout",
        "text": "Layout"
      },
      {
        "link": "/link",
        "text": "Link"
      },
      {
        "link": "/text",
        "text": "Text",
        "promotion": "2.3.0"
      },
      {
        "link": "/scrollbar",
        "text": "Scrollbar"
      },
      {
        "link": "/space",
        "text": "Space"
      },
      {
        "link": "/typography",
        "text": "Typography"
      }*/
    ]
  }
}

export const tsSidebar = _.reduce(components,(result,value,key)=>{
   result.push({
     text:value.text,
     items:value.children.map(x=>{
         return {
            text:x.text,
            link:`/ts/${x.link}`
         }
     })
   })
  return result
},[])

