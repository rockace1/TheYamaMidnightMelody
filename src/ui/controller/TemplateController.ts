

const query = (page: number, size: number) => {
    let data = window.ipcRenderer.sendSync('queryTemplate', { pageNum: page, size: size });
    console.log(data);
    return data;
}

export default { query }