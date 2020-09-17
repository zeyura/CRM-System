export default {
    bind(el, {value}) {
        M.Tooltip.init(el, {
            html: value,
            inDuration: 200,
            outDuration: 100,
            position: 'top'
        })
    },
    unbind(el) {
        // чтоб не было утечек памяти и накопления экземпляров сразу  удаляем тултипы..
        // https://materializecss.com/tooltips.html
        const i = M.Tooltip.getInstance(el);

        if(i && i.destroy) {
            i.destroy();
        }
    }
}
