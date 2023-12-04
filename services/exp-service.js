import { Types } from 'mongoose'
import UserModel from '../models/user.js'

/**
 * Adds experience points with a bonus coming from an event
 * @param {Number} currentExp Current user exp
 * @param {Number} currentLevel Current user level
 * @param {Number} addedBonus Bonus value to add
 * @param {Number} bonusPerse Bonus %
 * @returns Array: new value for the exp and the new level value
 */
export function addExpWithBonus(currentExp, currentLevel, addedBonus, bonusPerse) {
    currentExp += Math.round(addedBonus + (addedBonus * bonusPerse) / 100)

    if (currentExp > 100 * currentLevel) {
        currentExp -= 100 * currentLevel
        currentLevel++
    }

    return [currentExp, currentLevel]
}

/**
 * Adds experience points
 * @param {Number} currentExp Current user exp
 * @param {Number} currentLevel Current user level
 * @param {Number} addedExp Experience points to add
 * @returns Array: new value for the exp and the new level value
 */
export function addExpWithoutBonus(currentExp, currentLevel, addedExp) {
    currentExp += addedExp

    if (currentExp > 100 * currentLevel) {
        currentExp -= 100 * currentLevel
        currentLevel++
    }

    return [currentExp, currentLevel]
}

/**
 *
 * @param {(number | boolean)[]} activeEvent
 * @param {Types.ObjectId | undefined} userId
 * @param {Number} bonus
 */
export async function updateUserLevel(activeEvent, userId, bonus) {
    const user = await UserModel.findOne({ _id: userId })

    if (user) {
        // [currentExp, currentLevel]
        const levelValues = activeEvent[0]
            ? addExpWithBonus(
                  user.exp,
                  user.level,
                  bonus,
                  // @ts-ignore
                  activeEvent[1]
              )
            : addExpWithoutBonus(user.exp, user.level, bonus)

        await UserModel.updateOne(
            {
                _id: userId,
            },
            {
                exp: levelValues[0],
                level: levelValues[1],
            },
            { upsert: false }
        )
    }
}
