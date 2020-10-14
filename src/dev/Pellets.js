
IDRegistry.genItemID("blue_pellet")
IDRegistry.genItemID("red_pellet")

Item.createFoodItem("blue_pellet", "Blue pellet", { name: "blue_pellet" }, { stack: 8, food: 4 })
Item.createFoodItem("red_pellet", "Red pellet", { name: "red_pellet" }, { stack: 8, food: 4 })

Callback.addCallback("FoodEaten", function (food, ratio, player) {
    var client = Network.getClientForPlayer(player);
    var clientPlayer = client.getPlayerUid()
    switch (Entity.getCarriedItem(clientPlayer).id) {
        case ItemID.blue_pellet:
            switch (Entity.getDimension(clientPlayer)) {
                case 1: case -1:
                    PlayerTransfer(0, clientPlayer)
                case 0:
                    Entity.addEffect(clientPlayer, Native.PotionEffect.absorption, 5, 6000)
                    Entity.addEffect(clientPlayer, Native.PotionEffect.damageBoost, 2, 6000)
                    Entity.addEffect(clientPlayer, Native.PotionEffect.damageResistance, 2, 6000)
                    Entity.addEffect(clientPlayer, Native.PotionEffect.digSpeed, 2, 6000)
                    break
            }
            break
        case ItemID.red_pellet:
            Entity.addEffect(clientPlayer, Native.PotionEffect.regeneration, 5, 12000)
            Entity.addEffect(clientPlayer, Native.PotionEffect.damageResistance, 2, 12000)
            PlayerTransfer(1997, clientPlayer)
            break
    }
})
