import { BaseChannel } from "./BaseChannel.ts";
import type { Client, SendMessage } from "../Client.ts";
import type { channel, Snowflake } from "../discord.ts";
import { User } from "./User.ts";

export class DMChannel extends BaseChannel {
  lastMessageId: Snowflake | null;
  recipient: User;
  lastPinTimestamp?: number;

  constructor(client: Client, data: channel.DMChannel) {
    super(client, data);

    this.lastMessageId = data.last_message_id;
    this.recipient = new User(client, data.recipients[0]);
    this.lastPinTimestamp = data.last_pin_timestamp
      ? Date.parse(data.last_pin_timestamp)
      : undefined;
  }

  async startTyping() {
    await this.client.rest.triggerTypingIndicator(this.id);
  }

  async sendMessage(data: SendMessage) {
    return this.client.sendMessage(this.id, data);
  }

  async getPins() {
    return this.client.getPins(this.id);
  }

  async delete() {
    const channel = await this.client.rest.deleteChannel(this.id) as channel.DMChannel;
    return new DMChannel(this.client, channel);
  }
}
