
var MatrixDimension = new Dimensions.CustomDimension("Matrix", 1997)
var generator = new Dimensions.CustomGenerator("overworld").setModGenerationBaseDimension(0).setBuildVanillaSurfaces(true).setGenerateVanillaStructures(true)
MatrixDimension.setCloudColor(0, 0, 0)
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
    rainStyles: {
        normal: 9,
        zero_one: 2
    },
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

        if (this.data.first == true)
            this.startDialog()
    },
    add(coords, radius, count) {
        let rainStyle = this.rainStyles.zero_one
        for (var i = 0; i < count; i++) {
            let x = coords.x - radius + Math.random() * radius * 2
            let y = coords.y - radius + Math.random() * radius * 2
            let z = coords.z - radius + Math.random() * radius * 2
            for (let i = 0; i < rainStyle; i++)
                Particles.addParticle(this.particles[randomInt(0, rainStyle - 1)], x + Math.random() * 1.382, y + i, z + Math.random() * 1.382, 0, -0.35, 0)
        }
    },
    startDialog() {
        switch (this.data.ticks) {
            case 20: Game.message(Native.Color.GREEN + this.dialog[0]); break
            case 80: Game.message(Native.Color.GREEN + this.dialog[1]); break
            case 160:
                Game.message(Native.Color.GREEN + this.dialog[2])
                let c = Player.getPosition()
                Entity.spawn(c.x + randomInt(5, 15), c.y + 2, c.z + randomInt(5, 15), Native.EntityType.RABBIT)
                this.data.first == false
                this.data.ticks == 0
                break
        }

    }
}

Matrix.regParticles(["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9",])

Callback.addCallback("LocalTick", function () {
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

Callback.addCallback("ItemUse", function (coords, item, block, isExternal, player) {
    if (block.id == BlockID.matrix_tel) {
        var client = Network.getClientForPlayer(player)
        var clientPlayer = client.getPlayerUid()
        PlayerTransfer(0, clientPlayer)
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


TileEntity.registerPrototype(BlockID.matrix_dish, {
    useNetworkItemContainer: true,
    client: {
        updateItem() {
            let id = Network.serverToLocalId(this.networkData.getInt("itemId"))
            let data = this.networkData.getInt("itemData")
            
            this.itemAnim.load()
            this.itemAnim.describeItem({
                id: id, count: 1, data: data, notRandomize: true, rotation: [Math.PI / 2, 0, 0], size: 0.5
            })
            this.itemAnim.refresh()
            this.itemAnim.updateRender()
        },
        load() {
            this.itemAnim = new Animation.Item(this.x + 0.5, this.y + 2 / 16, this.z + 0.5)
            var _this = this
            this.networkData.addOnDataChangedListener(function (data, isExternal) {
                _this.updateItem()
            })
        },
        unload() {
            this.itemAnim.destroy()
        }
    },
    click(id, count, data, coords, player) {
        let con = this.container
        let item = con.getSlot("itemSlot")
        let client = Network.getClientForPlayer(player)
        let clientPlayer = client.getPlayerUid()
        let bs = BlockSource.getDefaultForActor(clientPlayer)
        alert('1:  ' + item.id + ' ' + item.count + ' ' + item.data)
        alert('1:  ' + id + ' ' + count + ' ' + data)
        if (item.id == 0 && item.count == 0 && id !== 0 && count != 0) {
            count = 1
            let carr = Entity.getCarriedItem(clientPlayer)
            Entity.setCarriedItem(clientPlayer, carr.id, carr.count - 1, carr.data)
        } else {
            id = 0, count = 0, data = 0
            bs.spawnDroppedItem(coords.x + 0.5, coords.y + 0.2, coords.z + 0.5, item.id, item.count, item.data)
        }

        con.setSlot("itemSlot", id, count, data)
        con.validateSlot("itemSlot")
        alert('2:  ' + item.id + ' ' + item.count + ' ' + item.data)
        alert('2:  ' + id + ' ' + count + ' ' + data)
        con.sendChanges()
        this.networkData.putInt("itemId", id)
        this.networkData.putInt("itemData", data)
        this.networkData.sendChanges()
        return true
    }
})


Saver.addSavesScope("MatrixData",
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
    var coords = GenerationUtils.findSurface(chunkX * 16 + random.nextInt(16), 96, chunkZ * 16 + random.nextInt(16))
    // generateMetro()
})

