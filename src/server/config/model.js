import { readFile } from 'fs/promises';
import { VIEW_ROOT, INDEX, GATEWAY_PREFIX } from './constants.js'

export async function modelAndView(viewPath, params) {
    try {
        const [index, content] = await Promise.all([ 
            // html           
            readFile(INDEX, 'utf-8'),            
            // 실제 내용 페이지
            readFile(`${VIEW_ROOT}/${viewPath}`, 'utf-8')
        ]);

        let html = index.replace('<main>', `<main>${content}`);       
        return html.replace(/\$\{prefix\}/g, GATEWAY_PREFIX ?? '');
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default { modelAndView };