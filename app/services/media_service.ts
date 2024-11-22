const changeMediaFormat = (packages: Array<any>) => {
    let mediaList = []
    for (let i = 0; i < packages.length; i++) {
        let media = {
            mediaId: Number(packages[i].media.mediaId),
            mediaDesc: packages[i].media.mediaDesc
        }
        mediaList.push(media)
    }

    return mediaList
}

export default { changeMediaFormat }