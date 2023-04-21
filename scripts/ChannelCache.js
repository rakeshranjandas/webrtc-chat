const ChannelCache = new Map()

function saveInChannelCache(user, channel) {
  if (!ChannelCache.has(user)) ChannelCache.set(user, channel)
}
