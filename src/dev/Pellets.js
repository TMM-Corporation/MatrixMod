
IDRegistry.genItemID("blue_pellet")
IDRegistry.genItemID("red_pellet")

Item.createFoodItem("blue_pellet", "Blue pellet", { name: "blue_pellet" }, { stack: 8, food: 4 })
Item.createFoodItem("red_pellet", "Red pellet", { name: "red_pellet" }, { stack: 8, food: 4 })

Recipes.addShaped({ id: ItemID.blue_pellet, count: 1, data: 0 }, [
    "ax",
    "xa",
    "ax"
], ['x', 265, 0, 'a', 266, 0])


Callback.addCallback("FoodEaten", function (food, ratio, player) {
    var client = Network.getClientForPlayer(player)
    var clientPlayer = client.getPlayerUid()
    switch (Entity.getCarriedItem(clientPlayer).id) {
        case ItemID.blue_pellet:
            if (Entity.getDimension(clientPlayer) == 0) {
                Entity.addEffect(clientPlayer, Native.PotionEffect.absorption, 5, 6000)
                Entity.addEffect(clientPlayer, Native.PotionEffect.damageBoost, 2, 6000)
                Entity.addEffect(clientPlayer, Native.PotionEffect.damageResistance, 2, 6000)
                Entity.addEffect(clientPlayer, Native.PotionEffect.digSpeed, 2, 6000)
            }
            break
        case ItemID.red_pellet:
            Entity.addEffect(clientPlayer, Native.PotionEffect.regeneration, 5, 12000)
            Entity.addEffect(clientPlayer, Native.PotionEffect.damageResistance, 2, 12000)
            PlayerTransfer(1997, clientPlayer)
            break
    }
})
