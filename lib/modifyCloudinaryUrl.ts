export const modifyCloudinaryUrl = (url: string, width:number, height: number) => {
    const urlParts = url.split("/");
    const transformationIndex = urlParts.findIndex(part => part === "upload") + 1;
    const transformation = `w_${width},h_${height}`;
    urlParts.splice(transformationIndex, 0, transformation);
    return urlParts.join("/");
};