
IDRegistry.genItemID("blue_pellet")
IDRegistry.genItemID("red_pellet")

Item.createFoodItem("blue_pellet", "Blue pellet", { name: "blue_pellet" }, { stack: 8, food: 8 })
Item.createFoodItem("red_pellet", "Red pellet", { name: "red_pellet" }, { stack: 8, food: 16 })

Recipes.addShaped({ id: ItemID.blue_pellet, count: 1, data: 0 }, [
    "abc"
], ['a', 322, 0, 'b', 396, 0, 'c', 351, 18])
Recipes.addShaped({ id: ItemID.red_pellet, count: 1, data: 0 }, [
    "abc", 'de'
], ['a', 322, 0, 'b', 396, 0, 'c', 351, 1, 'd', 382, 0, 'e', 368, 0])


Callback.addCallback("FoodEaten", function (food, ratio, player) {
    var client = Network.getClientForPlayer(player)
    var clientPlayer = client.getPlayerUid()
    switch (Entity.getCarriedItem(clientPlayer).id) {
        case ItemID.blue_pellet:
            Entity.addEffect(clientPlayer, Native.PotionEffect.absorption, 5, 6000)
            Entity.addEffect(clientPlayer, Native.PotionEffect.damageBoost, 2, 6000)
            Entity.addEffect(clientPlayer, Native.PotionEffect.damageResistance, 2, 6000)
            Entity.addEffect(clientPlayer, Native.PotionEffect.digSpeed, 2, 6000)
            break
        case ItemID.red_pellet:
            Entity.addEffect(clientPlayer, Native.PotionEffect.regeneration, 5, 12000)
            Entity.addEffect(clientPlayer, Native.PotionEffect.damageResistance, 2, 12000)
            PlayerTransfer(1997, clientPlayer)
            break
    }
})
