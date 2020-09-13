
IDRegistry.genItemID("blue_pellet")
IDRegistry.genItemID("red_pellet")

Item.createFoodItem("blue_pellet", "Blue pellet", { name: "blue_pellet" }, { stack: 8, food: 4 })
Item.createFoodItem("red_pellet", "Red pellet", { name: "red_pellet" }, { stack: 8, food: 4 })
function PlayerTransfer(dim) {
    if (dim == 1997) {
        Matrix.data.time = World.getWorldTime()
    } else {
        if (Matrix.data.time != 0 && Player.getDimension() != 0)
            World.setWorldTime(Matrix.data.time)
    }
    Dimensions.transfer(Player.get(), dim)
    if (Player.getPosition().y < 5)
        for (let i = 0; i < 254; i++) {
            let pos = Player.getPosition()
            if (World.getBlock(pos.x, i - 1, pos.z).id !== 0) {
                Player.setPosition(pos.x, i + 1, pos.z)
                break
            }
        }
}
Callback.addCallback("FoodEaten", function () {
    switch (Player.getCarriedItem().id) {
        case ItemID.blue_pellet:
            switch (Player.getDimension()) {
                case 1:
                case -1:
                    PlayerTransfer(0)
                case 0:
                    Entity.addEffect(Player.get(), Native.PotionEffect.absorption, 5, 6000)
                    Entity.addEffect(Player.get(), Native.PotionEffect.damageBoost, 2, 6000)
                    Entity.addEffect(Player.get(), Native.PotionEffect.damageResistance, 2, 6000)
                    Entity.addEffect(Player.get(), Native.PotionEffect.digSpeed, 2, 6000)
                    break
            }
            break
        case ItemID.red_pellet:
            Entity.addEffect(Player.get(), Native.PotionEffect.regeneration, 5, 12000)
            Entity.addEffect(Player.get(), Native.PotionEffect.damageResistance, 2, 12000)
            PlayerTransfer(1997)
            break
    }
})

var MatrixDimension = new Dimensions.CustomDimension("Matrix", 1997)
var generator = new Dimensions.CustomGenerator("overworld").setModGenerationBaseDimension(0).setBuildVanillaSurfaces(true).setGenerateVanillaStructures(true)
MatrixDimension.setCloudColor(0, 0, 0)
// MatrixDimension.setFogColor(0, 0, 0)
MatrixDimension.setSkyColor(0, 0, 0)
MatrixDimension.setSunsetColor(0, 0, 0)
MatrixDimension.setGenerator(generator)

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
var Matrix = {
    data: {
        ticks: 0,
        time: 0,
        first: true,
    },
    particles: [],
    dialog: [
        "Wake up, Neo...",
        "The Matrix has you...",
        "Follow the white rabbit."
    ],
    commands: {
        noclip: null, nightvision: null, slow: null,
        fly: null, gm: null, speed: null,
        normalspeed: null, transfer: null,
    },
    regParticles(list) {
        for (let i in list) {
            this.particles.push(
                Particles.registerParticleType({
                    texture: list[i],
                    size: [2, 2],
                    lifetime: [1, 40],
                    render: 2
                })
            )
        }
    },
    tick() {
        this.data.ticks++
        this.startDialog()
    },

    add(coords, radius, count) {
        for (var i = 0; i < count; i++) {
            let x = coords.x - radius + Math.random() * radius * 2
            let y = coords.y - radius + Math.random() * radius * 2
            let z = coords.z - radius + Math.random() * radius * 2
            for (let i = 0; i < this.particles.length; i++) {
                Particles.addParticle(this.particles[randomInt(0, this.particles.length - 1)], x + Math.random() * 1.382, y + i, z + Math.random() * 1.382, 0, -0.35, 0)
            }
        }
    },
    startDialog() {
        if (this.data.first == true)
            switch (this.data.ticks) {
                case 20: Game.message(Native.Color.GREEN + this.dialog[0]); break
                case 60: Game.message(Native.Color.GREEN + this.dialog[1]); break
                case 100:
                    Game.message(Native.Color.GREEN + this.dialog[2])
                    let c = Player.getPosition()
                    Entity.spawn(c.x + randomInt(5, 15), c.y + 2, c.z + randomInt(5, 15), Native.EntityType.RABBIT)
                    this.data.first == false
                    this.data.ticks == 0
                    break

                default:
                    break
            }

    }
}

Matrix.regParticles(["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9",])

Callback.addCallback("tick", function () {
    let coords = Entity.getPosition(Player.get())
    if (Player.getDimension() == 1997) {
        if (World.getThreadTime() % 4 === 0) {
            World.setWorldTime(22000)
            Matrix.add(coords, 5, 4)
            Matrix.tick()
        }
    }
})

Callback.addCallback("NativeCommand", function (str) {
    str = str.split(" ")
    let cmdName = str[0]
    let cmdArg = str[1]
    if (str[0].replace("/", "") in Matrix.commands)
        Game.prevent()

    switch (cmdName) {
        case "/noclip":
            Player.setAbility(Native.PlayerAbility.NOCLIP, Boolean(cmdArg || false) || false)
            break
        case "/nightvision":
            Boolean(cmdArg) == true ?
                Entity.addEffect(Player.get(), Native.PotionEffect.nightVision, 0, 200000) :
                Entity.clearEffect(Player.get(), Native.PotionEffect.nightVision)
            break
        case "/fly":
            Player.setAbility(Native.PlayerAbility.MAYFLY, Boolean(cmdArg || false) || false)
            break
        case "/gm":
            switch (Number(cmdArg)) {
                case 0: Game.setGameMode(Native.GameMode.SURVIVAL); break
                case 1: Game.setGameMode(Native.GameMode.CREATIVE); break
                case 2: Game.setGameMode(Native.GameMode.ADVENTURE); break
                case 3: Game.setGameMode(Native.GameMode.SPECTATOR); break
                default: Game.setGameMode(Native.GameMode.SURVIVAL); break
            } break
        case "/speed":
            Player.setAbility(Native.PlayerAbility.WALKSPEED, 2.5)
            Player.setAbility(Native.PlayerAbility.FLYSPEED, 2.5)
            break
        case "/slow":
            Player.setAbility(Native.PlayerAbility.WALKSPEED, 0.001)
            Player.setAbility(Native.PlayerAbility.FLYSPEED, 0.001)
            break
        case "/normalspeed":
            Player.setAbility(Native.PlayerAbility.WALKSPEED, 0.05)
            Player.setAbility(Native.PlayerAbility.FLYSPEED, 0.1)
            break
        case "/transfer":
            let dim = Player.getDimension()
            if (dim != 0 && dim != 1 && dim != -1) PlayerTransfer(Number(cmdArg) || 0)
            break
        case "/help":
            Game.message("Matrix Commands: noclip, nightvision, fly, gm, speed, slow, normalspeed"); break
    }
})

IDRegistry.genBlockID("matrix_tel")
Block.createBlock("matrix_tel", [{ name: "Matrix Telephone", textures: [["cauldron_inner", 0]], inCreative: true }])
var telMesh = new RenderMesh()
telMesh.setBlockTexture("tel", 0)
telMesh.importFromFile(__dir__ + "assets/mod_assets/models/tel.obj", "obj", { translate: [1, 0, 1], scale: [1 / 16, 1 / 16, 1 / 16] })
var icrender1 = new ICRender.Model()
icrender1.addEntry(new BlockRenderer.Model(telMesh))
BlockRenderer.setStaticICRender(BlockID.matrix_tel, 0, icrender1)

Callback.addCallback("ItemUse", function (coords, item, block) {
    if (block.id == BlockID.matrix_tel) {
        PlayerTransfer(0)
    }
})
function getBlockRotation(isFull) {
    var pitch = Entity.getLookAngle(Player.get()).pitch
    if (isFull) {
        if (pitch < -45) return 0
        if (pitch > 45) return 1
    }
    var yaw = Entity.getLookAngle(Player.get()).yaw
    while (yaw == 0) {
        var yaw = Entity.getLookAngle(Player.get()).yaw
    }
    if (yaw == 0) return this.getBlockRotation(isFull)
    var rotation = Math.floor((yaw - 45) % 360 / 90)
    if (rotation < 0) rotation += 4
    rotation = [3, 1, 2, 0][rotation]
    if (isFull) return rotation + 2
    return rotation
}



IDRegistry.genBlockID("matrix_dish")
Block.createBlock("matrix_dish", [{ name: "Dish", textures: [["cauldron_inner", 0]], inCreative: true }])
var dishMesh = new RenderMesh()
dishMesh.setBlockTexture("dish", 0)
dishMesh.importFromFile(__dir__ + "assets/mod_assets/models/dish.obj", "obj", { translate: [1, 0, 1], scale: [1 / 16, 1 / 16, 1 / 16] })
var icrender2 = new ICRender.Model()
icrender2.addEntry(new BlockRenderer.Model(dishMesh))
BlockRenderer.setStaticICRender(BlockID.matrix_dish, 0, icrender2)
Block.setShape(BlockID.matrix_dish, 0, 0, 0, 1, 2.5 / 16, 1)


TileEntity.registerPrototype(BlockID.matrix_dish, {
    defaultValues: {
        item: { id: 0, count: 0, data: 0 },
        itemAnim: null
    },
    init() {
        this.data.itemAnim = new Animation.Item(this.x + 0.5, this.y + 0.2, this.z + 0.5)
        this.updateItem()
    },
    click(id, count, data, coords) {
        let item = this.data.item
        if (item.id == 0 && item.count == 0 && id !== 0 && count != 0) {
            this.data.item = {
                id: id, count: 1, data: data
            }
            let carr = Player.getCarriedItem()
            Player.setCarriedItem(carr.id, carr.count - 1, carr.data)
        } else {
            this.data.item = {
                id: 0, count: 0, data: 0
            }
            World.drop(coords.x + 0.5, coords.y + 0.2, coords.z + 0.5, item.id, item.count, item.data)
        }
        this.updateItem()
    },
    updateItem() {
        let item = this.data.item
        this.data.itemAnim.load()
        this.data.itemAnim.describeItem({
            id: item.id, count: 1, data: item.data, notRandomize: true, rotation: [Math.PI / 2, 0, 0]
        })
        this.data.itemAnim.refresh()
        this.data.itemAnim.updateRender()
    }
})


Saver.addSavesScope("PouchScope",
    function read(scope) {
        Matrix.data = scope.data || {
            ticks: 0,
            time: 0,
            first: true,
        }
    },
    function save() {
        return {
            data: Matrix.data
        }
    }
)
Callback.addCallback("GenerateCustomDimensionChunk", function (chunkX, chunkZ, random, dimID) {
    if (dimID != 1997) return
    // GenerationUtils.findSurface(chunkX, y, chunkZ)
})


IDRegistry.genBlockID("matrix_pc")
Block.createBlock("matrix_pc", [{ name: "Pc", textures: [["cauldron_inner", 0]], inCreative: true }])
var dishMesh = new RenderMesh()
dishMesh.setBlockTexture("pc", 0)
dishMesh.importFromFile(__dir__ + "assets/mod_assets/models/pc.obj", "obj",
    {
        translate: [1, 0, 1], scale: [1 / 16, 1 / 16, 1 / 16]
    })
var icrender3 = new ICRender.Model()
icrender3.addEntry(new BlockRenderer.Model(dishMesh))
BlockRenderer.setStaticICRender(BlockID.matrix_pc, 0, icrender3)
Block.setShape(BlockID.matrix_pc, 0, 0, 0, 1, 2.5 / 16, 1)
