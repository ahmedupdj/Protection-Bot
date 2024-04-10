const mongoose = require('mongoose');


const protectionSettingsSchema = mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
//Links
  isCodeEnabledProtectionLink: {
    type: Boolean,
    default:false
  },
  RoomLink: {
    type:String,
    default:null
  },

//Bots
  isCodeEnabledAntiBot: { 
    type:Boolean,
    default:false
  },

  isCodeEnabledAntiBotTrusted: {
    type:Boolean,
    default:false
  },

//Bans
isCodeEnabledAntiBan: { 
  type:Boolean,
  default:false
},
LimitBan : {
  type:Number,
  default: 3 
},
PunishmentBan: {
  type:Number,
  default: 1
},
//Kicks
isCodeEnabledAntiKicks: { 
  type:Boolean,
  default:false
},
LimitKicks : {
  type:Number,
  default: 3 
},
PunishmentKicks: {
  type:Number,
  default: 1
},
//ChannelCreate
isCodeEnabledAntiChannelCreate: { 
  type:Boolean,
  default:false
},
LimitChannelCreate : {
  type:Number,
  default: 3 
},
PunishmentChannelCreate: {
  type:Number,
  default: 1
},
//ChannelDelete
isCodeEnabledAntiChannelDelete: { 
  type:Boolean,
  default:false
},
LimitChannelDelete : {
  type:Number,
  default: 3 
},
PunishmentChannelDelete: {
  type:Number,
  default: 1
},
//RoleCreate
isCodeEnabledAntiRoleCreate: { 
  type:Boolean,
  default:false
},
LimitRoleCreate : {
  type:Number,
  default: 3 
},
PunishmentRoleCreate: {
  type:Number,
  default: 1
},
//RoleDelete
isCodeEnabledAntiRoleDelete: { 
  type:Boolean,
  default:false
},
LimitRoleDelete : {
  type:Number,
  default: 3 
},
PunishmentRoleDelete: {
  type:Number,
  default: 1
},
});

module.exports = mongoose.model('protectionSettings', protectionSettingsSchema);