import parse from 'html-react-parser'

export function trimDescription(description){
    const stringedDescription = String(description);
    if(stringedDescription.length>50){
        const trimmedContent =  `${stringedDescription.slice(0,70)}...`
        return parse(trimmedContent)
    }
    return parse(stringedDescription)
}