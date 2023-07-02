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
        "link": "/button",
        "text": "Button"
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
  },
  "configuration": {
    "text": "Configuration",
    "children": [
      {
        "link": "/config-provider",
        "text": "Config Provider"
      }
    ]
  },
  "form": {
    "text": "Form",
    "children": [
      {
        "link": "/autocomplete",
        "text": "Autocomplete"
      },
      {
        "link": "/cascader",
        "text": "Cascader"
      },
      {
        "link": "/checkbox",
        "text": "Checkbox"
      },
      {
        "link": "/color-picker",
        "text": "Color Picker"
      },
      {
        "link": "/date-picker",
        "text": "Date Picker"
      },
      {
        "link": "/datetime-picker",
        "text": "DateTime Picker"
      },
      {
        "link": "/form",
        "text": "Form"
      },
      {
        "link": "/input",
        "text": "Input"
      },
      {
        "link": "/input-number",
        "text": "Input Number"
      },
      {
        "link": "/radio",
        "text": "Radio"
      },
      {
        "link": "/rate",
        "text": "Rate"
      },
      {
        "link": "/select",
        "text": "Select"
      },
      {
        "link": "/select-v2",
        "text": "Virtualized Select"
      },
      {
        "link": "/slider",
        "text": "Slider"
      },
      {
        "link": "/switch",
        "text": "Switch"
      },
      {
        "link": "/time-picker",
        "text": "Time Picker"
      },
      {
        "link": "/time-select",
        "text": "Time Select"
      },
      {
        "link": "/transfer",
        "text": "Transfer"
      },
      {
        "link": "/upload",
        "text": "Upload"
      }
    ]
  },
  "data": {
    "text": "Data",
    "children": [
    /*  {
        "link": "/avatar",
        "text": "Avatar"
      },
      {
        "link": "/badge",
        "text": "Badge"
      },
      {
        "link": "/calendar",
        "text": "Calendar"
      },
      {
        "link": "/card",
        "text": "Card"
      },
      {
        "link": "/carousel",
        "text": "Carousel"
      },
      {
        "link": "/collapse",
        "text": "Collapse"
      },
      {
        "link": "/descriptions",
        "text": "Descriptions"
      },
      {
        "link": "/empty",
        "text": "Empty"
      },
      {
        "link": "/image",
        "text": "Image"
      },
      {
        "link": "/infinite-scroll",
        "text": "Infinite Scroll"
      },*/
      {
        "link": "/pagination",
        "text": "Pagination"
      },
      /*{
        "link": "/progress",
        "text": "Progress"
      },
      {
        "link": "/result",
        "text": "Result"
      },
      {
        "link": "/skeleton",
        "text": "Skeleton"
      },*/
      {
        "link": "/table",
        "text": "Table"
      },
     /* {
        "link": "/table-v2",
        "text": "Virtualized Table",
        "promotion": "2.2.0"
      },
      {
        "link": "/tag",
        "text": "Tag"
      },
      {
        "link": "/timeline",
        "text": "Timeline"
      },
      {
        "link": "/tree",
        "text": "Tree"
      },
      {
        "link": "/tree-select",
        "text": "TreeSelect",
        "promotion": "2.1.8"
      },
      {
        "link": "/tree-v2",
        "text": "Virtualized Tree"
      },
      {
        "link": "/statistic",
        "text": "Statistic",
        "promotion": "2.2.30"
      }*/
    ]
  },
  "navigation": {
    "text": "Navigation",
    "children": [
 /*     {
        "link": "/affix",
        "text": "Affix"
      },
      {
        "link": "/backtop",
        "text": "Backtop"
      },
      {
        "link": "/breadcrumb",
        "text": "Breadcrumb"
      },
      {
        "link": "/dropdown",
        "text": "Dropdown"
      },
      {
        "link": "/menu",
        "text": "Menu"
      },
      {
        "link": "/page-header",
        "text": "Page Header"
      },
      {
        "link": "/steps",
        "text": "Steps"
      },*/
      {
        "link": "/tabs",
        "text": "Tabs"
      }
    ]
  },
  "feedback": {
    "text": "Feedback",
    "children": [
    /*  {
        "link": "/alert",
        "text": "Alert"
      },*/
      {
        "link": "/dialog",
        "text": "Dialog"
      },
    /*  {
        "link": "/drawer",
        "text": "Drawer"
      },
      {
        "link": "/loading",
        "text": "Loading"
      },
      {
        "link": "/message",
        "text": "Message"
      },
      {
        "link": "/message-box",
        "text": "Message Box"
      },
      {
        "link": "/notification",
        "text": "Notification"
      },
      {
        "link": "/popconfirm",
        "text": "Popconfirm"
      },
      {
        "link": "/popover",
        "text": "Popover"
      },
      {
        "link": "/tooltip",
        "text": "Tooltip"
      }*/
    ]
  },
/*  "others": {
    "text": "Others",
    "children": [
      {
        "link": "/divider",
        "text": "Divider"
      }
    ]
  }*/
}

export const sidebar = _.reduce(components,(result,value,key)=>{
   result.push({
     text:value.text,
     items:value.children.map(x=>{
         return {
            text:x.text,
            link:`/element-ui/${x.link}`
         }
     })
   })
  return result
},[])

