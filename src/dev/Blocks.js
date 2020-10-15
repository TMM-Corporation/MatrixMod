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


function regBlockWithModel(info) {
    var block = info.block
    var meshProps = info.model
    var shp = info.shape
    var recipe = info.recipe

    IDRegistry.genBlockID(block.id)
    Block.createBlock(block.id, [{ name: block.name, texture: block.textures, inCreative: true }], { lightopacity: 0, translucency: 1 })

    if (meshProps) {
        for (let i = 0; i < 4; i++) {
            let mesh = new RenderMesh()
            let icr = new ICRender.Model()
            mesh.setBlockTexture(meshProps.texture, 0)
            mesh.importFromFile(__dir__ + "resources/mod_assets/models/" + meshProps.modelFile, "obj", { translate: [1, 0, 1], scale: [1 / 16, 1 / 16, 1 / 16] })
            mesh.rotate(0.5, 0.5, 0.5, 0, rotations[i], 0)
            mesh.rebuild()
            mesh.setColor(255, 255, 255)
            icr.addEntry(new BlockRenderer.Model(mesh))
            BlockRenderer.setStaticICRender(BlockID[block.id], i, icr)
            ItemModel.getFor(BlockID[block.id], i).setHandModel(mesh, meshProps.texture)
            ItemModel.getFor(BlockID[block.id], i).setModUiSpriteName(meshProps.name, 0)
            // if (!meshProps.addToCreativeVariations && i == 0)
            //     Item.addToCreative(BlockID[block.id], 1, i)
            if (meshProps.addToCreativeVariations)
                Item.addToCreative(BlockID[block.id], 1, i)
        }
    }
    // Block.registerPlaceFunction(BlockID[block.id], function (c, item, bl, player) {
    //     let bs = BlockSource.getDefaultForActor(player)
    //         bs.setBlock(c.x, c.y, c.z, BlockID[block.id], getBlockRotation(false, player))
    // }) //TODO: Ожидает фикса жеки
    if (shp)
        Block.setShape(BlockID[block.id], shp.from.x, shp.from.y, shp.from.z, shp.to.x, shp.to.y, shp.to.z)

    if (recipe)
        Recipes.addShaped({ id: BlockID[block.id], count: recipe.props.count || 1, data: recipe.props.data || -1 }, recipe.form, recipe.ingredients)

}
regBlockWithModel({
    block: { id: 'matrix_tel', name: 'Matrix Telephone', textures: [['cauldron_inner', 0], ['cauldron_inner', 0], ['cauldron_inner', 0]] },
    model: { texture: 'tel', modelFile: 'tel.obj', addToCreativeVariations: false, name: 'phone_item' },
    shape: {
        from: { x: 2 / 16, y: 0 / 16, z: 2 / 16 },
        to: { x: 14 / 16, y: 10 / 16, z: 14 / 16 }
    },
    recipe: {
        form: ["asa", "dfd", " g "],
        ingredients: ['a', 265, 0, 's', 101, 0, 'd', 77, 5, 'f', 148, 0, 'g', 42, 0],
        props: { count: 1, data: 0 }
    }
})
regBlockWithModel({
    block: { id: 'matrix_dish', name: 'Dish', textures: [['cauldron_inner', 0], ['cauldron_inner', 0], ['cauldron_inner', 0]] },
    model: { texture: 'dish', modelFile: 'dish.obj', addToCreativeVariations: false, name: 'dish_item' },
    shape: {
        from: { x: 3 / 16, y: 0 / 16, z: 3 / 16 },
        to: { x: 13 / 16, y: 2 / 16, z: 13 / 16 }
    },
    recipe: {
        form: ['a'],
        ingredients: ['a', 155, 3],
        props: { count: 6, data: 0 }
    }
})
regBlockWithModel({
    block: { id: 'matrix_pc', name: 'Pc', textures: [['cauldron_inner', 0], ['cauldron_inner', 0], ['cauldron_inner', 0]] },
    model: { texture: 'pc', modelFile: 'pc.obj', addToCreativeVariations: false, name: 'pc_item' },
    shape: {
        from: { x: 1 / 16, y: 0 / 16, z: 1 / 16 },
        to: { x: 15 / 16, y: 15 / 16, z: 15 / 16 }
    },
    recipe: {
        form: ['aba', 'ada', ' f '],
        ingredients: ['a', 171, 15, 'b', 321, 0, 'd', 101,0, 'f', -166, 1],
        props: { count: 1, data: 0 }
    }
})
Callback.addCallback("ItemUse", function (coords, i, block) {
    alert(Item.getName(i.id, i.data) + ' = ' + i.id + ', ' + i.data)
})