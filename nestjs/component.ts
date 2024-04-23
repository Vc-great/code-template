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
  "database": {
    "text": "database",
    "children": [
      {
        "link": "/prisma",
        "text": "prisma"
      }
    ]
  }
}

export const nestjsSidebar = _.reduce(components,(result,value,key)=>{
   result.push({
     text:value.text,
     items:value.children.map(x=>{
         return {
            text:x.text,
            link:`/nestjs/${x.link}`
         }
     })
   })
  return result
},[])

