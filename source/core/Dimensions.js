var MatrixDimension = new Dimensions.CustomDimension("Matrix", 1200)
var generator = new Dimensions.CustomGenerator("overworld").setModGenerationBaseDimension(0).setBuildVanillaSurfaces(true).setGenerateVanillaStructures(true)
// MatrixDimension.setCloudColor(0, 0, 0)
// MatrixDimension.setFogColor(0, 0, 0)
// MatrixDimension.setSkyColor(0, 0, 0)
// MatrixDimension.setSunsetColor(0, 0, 0)
MatrixDimension.setFogDistance(20, 100)
MatrixDimension.setGenerator(generator)

// Callback.addCallback("LevelLoaded", function () {
//     Dimensions.transfer(Player.get(), 1200)
// })
Callback.addCallback("ItemUse", function (coords, item) {
    if (item.id == 280) {
        alert("Current dim: " + Player.getDimension())
        Dimensions.transfer(Player.get(), 1200)
        alert("New dim: " + Player.getDimension())
    }
})

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
var Matrix = {
    ticks: 0,
    particles: [],
    commands: {
        noclip: false,
        nightvision: false,
        fly: false,
        gm: false,
        speed: false,
        slow: false,
        normalspeed: false
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
        this.ticks++
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
    }
}

Matrix.regParticles(["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9",])

Callback.addCallback("tick", function () {
    let coords = Entity.getPosition(Player.get())
    if (Player.getDimension() == 1200) {
        if (World.getThreadTime() % 4 === 0) {
            World.setWorldTime(22000)
            Matrix.add(coords, 5, 4)
        }
    }
})

Callback.addCallback("NativeCommand", function (str) {
    str = str.split(" ")
    let cmdName = str[0]
    let cmdArg = str[1]
    if (str[0].replace("/", '') in Matrix.commands)
        Game.prevent()

    Game.dialogMessage(str + ": [" + cmdName + ', ' + typeof cmdArg + ']', "NativeCommand")
    switch (cmdName) {
        case "/noclip":
            Player.setAbility(Native.PlayerAbility.NOCLIP, Boolean(cmdArg || false) || false)
            break
        case "/nightvision":
            cmdArg ?
                Entity.addEffect(Player.get(), Native.PotionEffect.nightVision, 0, 200000) :
                Entity.clearEffect(Player.get(), Native.PotionEffect.nightVision)
            break
        case "/fly":
            Player.setAbility(Native.PlayerAbility.MAYFLY, Boolean(cmdArg || false) || false)
            break
        case "/gm":
            switch (cmdArg) {
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
        case "/help":
            Game.message("Matrix Commands: noclip, nightvision, fly, gm, speed, slow, normalspeed"); break
    }
})