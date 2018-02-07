module Main where

import FRP (FRP)
import Prelude (Unit, bind, pure, ($), (&&), (<$>), (<*>))
import Control.Monad.Eff (Eff)
import Control.Plus ((<|>))
import FRP.Behavior (ABehavior, sample_, step)
import FRP.Event (Event, subscribe, create)

newtype Id = Id String
newtype Direction = Direction String
newtype Param = Param String
newtype Value1 = Value1 Int

foreign import updateCanvas :: ∀ eff.  Id -> Param -> Value1 -> Eff eff Unit
foreign import attachButtonEvents :: forall a b eff.  Id ->  (b ->  Eff (frp::FRP | eff) Unit) -> Unit

updateAll :: forall a. Eff a Unit
updateAll = do
  updateCanvas (Id "gear1") (Param "x") (Value1 1)


stopAll :: forall a. Eff a Unit
stopAll = do
  updateCanvas (Id "gear1") (Param "x") (Value1 1)

getButtons :: forall a. Id -> Eff ( frp :: FRP | a ) { behavior :: ABehavior Event Boolean , event :: Event Boolean }                                    
getButtons id = do
  o <- create
  let behavior = step true o.event
  let x = attachButtonEvents id o.push
  pure $ {behavior : behavior , event : o.event}



runSystem :: Boolean -> Boolean -> Boolean -> Boolean -> Boolean -> Boolean -> Boolean
runSystem a b c d e f = a && b && c && d && e && f

main :: forall a. Eff ( frp :: FRP | a ) (Eff  ( frp :: FRP | a ) Unit )              
main = do
  -- sig1 <- getSig (Id "gear1")
  buttonXPlus <- getButtons (Id "buttonXPlus")
  buttonXMius <- getButtons (Id "buttonXMinus")
  buttonYPlus <- getButtons (Id "buttonYPlus")
  buttonYMius <- getButtons (Id "buttonYMinus")
  buttonZPlus <- getButtons (Id "buttonZPlus")
  buttonZMius <- getButtons (Id "buttonZMinus")


  let behavior = runSystem <$> buttonXPlus.behavior <*> buttonXMius.behavior <*> buttonYPlus.behavior <*> buttonYMius.behavior <*> buttonZPlus.behavior <*> buttonZMius.behavior 
  sample_ behavior (buttonXPlus.event <|> buttonXMius.event <|> buttonYPlus.event <|> buttonYMius.event <|> buttonZPlus.event <|> buttonZMius.event) `subscribe` (\x -> if x then
                                                                                   updateAll
                                                                                 else
                                                                                   stopAll)
