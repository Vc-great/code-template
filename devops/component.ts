import _ from 'lodash'

type route = {
    [titleName: string]: routeContent
}

type routeContent = {
    text: string
    children: routeChildren[]
}

type routeChildren = {
    link: string
    text: string
}

const components: route = {
    "docker": {
        "text": "docker",
        "children": [
            {
                "link": "/docker-file",
                "text": "docker-file"
            }
        ]
    }
}

export const devopsSidebar = _.reduce(components, (result, value, key) => {
    result.push({
        text: value.text,
        items: value.children.map(x => {
            return {
                text: x.text,
                link: `/devops/${x.link}`
            }
        })
    })
    return result
}, [])

