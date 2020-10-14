function PlayerTransfer(dim, client) {
    if (dim == 1997) {
        Matrix.data.time = World.getWorldTime()
    } else {
        if (Matrix.data.time != 0 && Entity.getDimension(client) != 0)
            World.setWorldTime(Matrix.data.time)
    }
    Dimensions.transfer(client, dim)
    Callback.addCallback("PlayerChangedDimension", function (playerUid, currentId, lastId) {
        let p = Entity.getPosition(playerUid)
        for (let i = 0; i < 254; i++) {
            let bs = BlockSource.getDefaultForDimension(currentId)
            if (bs.getBlockId(p.x, i - 1, p.z) !== 0) {
                Entity.setPosition(playerUid, p.x, i + 2, p.z)
                break
            }
        }
    })

}
