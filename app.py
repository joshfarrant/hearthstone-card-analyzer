from pymongo import MongoClient

# Connect to db
client = MongoClient()
db = client.hearthstone

cardsDb = db.cards


def getCards(query, fields=None):
  cardsDb = db.cards

  if fields:
    cards = cardsDb.find(query, fields)
  else:
    cards = cardsDb.find(query)

  return cards


def printCards(cards):
  for card in cards:
    keys = card.keys()
    for key in keys:

      try:
        print key + ': ' + card[key]
      except (TypeError):
        print key + ': ' + str(card[key])
    print '\n'


def getFields(cards):
  fields = {}
  for card in cards:
    keys = card.keys()
    for key in keys:

      if key in ignore:
        continue

      if key not in fields.keys():
        fields[key] = list()

      if card[key] not in fields[key]:
        fields[key].append(card[key])

  return fields


def calculateMetadata(cards):
  notable = list()
  for card in cards:
    try:
      name   = card['name']
      attack = card['attack']
      health = card['health']
      cost   = card['cost']
      spirit = attack + health

      if cost != 0:
        value  = spirit / float(cost)
      else:
        value = 0

      card['spirit'] = spirit
      card['value']  = value

      if value <= 2:
        notable.append(card)

    except (TypeError):
      continue

  return notable


fields = [
  'attack',
  'health',
  'cost'
  ]

query = {}

cards = getCards(query)

notable = calculateMetadata(cards)

printCards(notable)







