var rotations = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2]
function rtd(r) {
    return r * (180 / Math.PI)
}
function getBlockRotation(isFull, clientPlayer) {
    let angle = Entity.getLookAngle(clientPlayer)
    let pitch = rtd(angle.pitch)
    let yaw = rtd(angle.yaw)

    if (isFull) {
        if (pitch < -45) return 0
        if (pitch > 45) return 1
    }

    while (yaw == 0)
        yaw = Entity.getLookAngle(clientPlayer).yaw

    let rotation = Math.floor((yaw - 45) % 360 / 90)
    if (rotation < 0) rotation += 4

    rotation = [3, 1, 2, 0][rotation]
    alert(pitch)
    alert(yaw)
    return isFull ? rotation + 2 : rotation
}


function regBlockWithModel(block, meshProps, shp) {
    IDRegistry.genBlockID(block.id)
    Block.createBlock(block.id, { name: block.name, texture: block.textures, inCreative: true }, { lightopacity: 0, translucency: 1 })

    if (meshProps) {
        for (let i = 0; i < 4; i++) {
            let mesh = new RenderMesh()
            let icr = new ICRender.Model()
            mesh.setBlockTexture(meshProps.texture, 0)
            mesh.importFromFile(__dir__ + "resources/mod_assets/models/" + meshProps.modelFile, "obj", { translate: [1, 0, 1], scale: [1 / 16, 1 / 16, 1 / 16] })
            mesh.rotate(0.5, 0.5, 0.5, 0, rotations[i], 0)
            icr.addEntry(new BlockRenderer.Model(mesh))
            BlockRenderer.setStaticICRender(BlockID[block.id], i, icr)
            ItemModel.getFor(BlockID[block.id], i).setHandModel(mesh, meshProps.texture)
            if (meshProps.addToCreativeVariations)
                Item.addToCreative(BlockID[block.id], 1, i)
        }
    }
    // Item.registerUseFunction(BlockID[block.id], function (c, item, bl, player) {
    //     let bs = BlockSource.getDefaultForActor(player)
    //     alert(getBlockRotation(false, player))
    //     alert(BlockID[block.id])
    //     alert(bs)
    //     if (bs.getBlockId(c.x, c.y + 1, c.z) == 0)
    //         bs.setBlock(c.x, c.y + 1, c.z, BlockID[block.id], getBlockRotation(false, player))
    // })
    if (shp)
        Block.setShape(BlockID[block.id], shp.from.x, shp.from.y, shp.from.z, shp.to.x, shp.to.y, shp.to.z)
}
regBlockWithModel(
    { id: 'matrix_tel', name: 'Matrix Telephone', textures: [['cauldron_inner', 0], ['cauldron_inner', 0], ['cauldron_inner', 0]] },
    { texture: 'tel', modelFile: 'tel.obj', addToCreativeVariations: false },
    {
        from: { x: 2 / 16, y: 0 / 16, z: 2 / 16 },
        to: { x: 14 / 16, y: 10 / 16, z: 14 / 16 }
    }
)
regBlockWithModel(
    { id: 'matrix_dish', name: 'Dish', textures: [['cauldron_inner', 0], ['cauldron_inner', 0], ['cauldron_inner', 0]] },
    { texture: 'dish', modelFile: 'dish.obj', addToCreativeVariations: false },
    {
        from: { x: 3 / 16, y: 9 / 16, z: 3 / 16 },
        to: { x: 13 / 16, y: 14 / 16, z: 13 / 16 }
    }
)
regBlockWithModel(
    { id: 'matrix_pc', name: 'Pc', textures: [['cauldron_inner', 0], ['cauldron_inner', 0], ['cauldron_inner', 0]] },
    { texture: 'pc', modelFile: 'pc.obj', addToCreativeVariations: false },
    {
        from: { x: 1 / 16, y: 0 / 16, z: 1 / 16 },
        to: { x: 15 / 16, y: 15 / 16, z: 15 / 16 }
    }
)