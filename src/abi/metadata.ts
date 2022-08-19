import {Abi} from "@subsquid/ink-abi"

export const metadata = {
  "source": {
    "hash": "0x1c873d4aa2afc7a0ea113d7a409e14b6ac05bebe0c55e43677d3447574fa236d",
    "language": "ink! 4.0.0",
    "compiler": "rustc 1.63.0-nightly"
  },
  "contract": {
    "name": "subsquid_contract",
    "version": "0.1.0",
    "authors": [
      "Stake Technologies <devops@stake.co.jp>"
    ]
  },
  "V3": {
    "spec": {
      "constructors": [
        {
          "args": [],
          "docs": [],
          "label": "new",
          "payable": false,
          "selector": "0x9bae9d5e"
        }
      ],
      "docs": [],
      "events": [
        {
          "args": [
            {
              "docs": [],
              "indexed": true,
              "label": "from",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 1
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "value",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 4
              }
            }
          ],
          "docs": [],
          "label": "ValueTransferred"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": true,
              "label": "from",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 1
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "value",
              "type": {
                "displayName": [
                  "bool"
                ],
                "type": 0
              }
            }
          ],
          "docs": [],
          "label": "ValueUpdated"
        }
      ],
      "messages": [
        {
          "args": [],
          "docs": [],
          "label": "transfer",
          "mutates": true,
          "payable": true,
          "returnType": null,
          "selector": "0x84a15da1"
        },
        {
          "args": [],
          "docs": [],
          "label": "update",
          "mutates": true,
          "payable": true,
          "returnType": null,
          "selector": "0x5f234f5d"
        }
      ]
    },
    "storage": {
      "struct": {
        "fields": [
          {
            "layout": {
              "cell": {
                "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "ty": 0
              }
            },
            "name": "value"
          }
        ]
      }
    },
    "types": [
      {
        "id": 0,
        "type": {
          "def": {
            "primitive": "bool"
          }
        }
      },
      {
        "id": 1,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "type": 2,
                  "typeName": "[u8; 32]"
                }
              ]
            }
          },
          "path": [
            "ink_env",
            "types",
            "AccountId"
          ]
        }
      },
      {
        "id": 2,
        "type": {
          "def": {
            "array": {
              "len": 32,
              "type": 3
            }
          }
        }
      },
      {
        "id": 3,
        "type": {
          "def": {
            "primitive": "u8"
          }
        }
      },
      {
        "id": 4,
        "type": {
          "def": {
            "primitive": "u128"
          }
        }
      }
    ]
  }
}

const _abi = new Abi(metadata)

export function decodeEvent(hex: string): Event {
  return _abi.decodeEvent(hex)
}

export function decodeMessage(hex: string): Message {
  return _abi.decodeMessage(hex)
}

export function decodeConstructor(hex: string): Constructor {
  return _abi.decodeConstructor(hex)
}

export type Event = Event_ValueTransferred | Event_ValueUpdated

export interface Event_ValueTransferred {
  __kind: 'ValueTransferred'
  from: AccountId
  value: Balance
}

export interface Event_ValueUpdated {
  __kind: 'ValueUpdated'
  from: AccountId
  value: bool
}

export type Message = Message_transfer | Message_update

export interface Message_transfer {
  __kind: 'transfer'
}

export interface Message_update {
  __kind: 'update'
}

export type Constructor = Constructor_new

export interface Constructor_new {
  __kind: 'new'
}

export type AccountId = Uint8Array

export type Balance = bigint

export type bool = boolean

export type Result<T, E> = {__kind: 'Ok', value: T} | {__kind: 'Err', value: E}
