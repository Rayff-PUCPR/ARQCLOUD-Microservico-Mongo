import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { getMongoConfig } from '../../config/app.config';
import { DeliveryRoute, RouteProps } from '../domain/route.entity';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status';

type RouteDocument = RouteProps & {
  _id: string;
};

@Injectable()
export class MongoRouteRepository implements RouteRepository, OnModuleDestroy {
  private client?: MongoClient;
  private collection?: Collection<RouteDocument>;

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
    }
  }

  async create(route: DeliveryRoute) {
    const props = route.toJSON();
    await (await this.routes()).updateOne(
      { _id: props.id },
      { $set: this.toDocument(props) },
      { upsert: true }
    );
    return props;
  }

  async findAll() {
    const rows = await (await this.routes())
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return rows.map((row) => this.toProps(row));
  }

  async findById(id: string) {
    const row = await (await this.routes()).findOne({ _id: id });
    return row ? this.toProps(row) : undefined;
  }

  async findByStatus(status: RouteStatus) {
    const rows = await (await this.routes())
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();

    return rows.map((row) => this.toProps(row));
  }

  async save(route: DeliveryRoute) {
    const props = route.toJSON();
    await (await this.routes()).updateOne(
      { _id: props.id },
      { $set: this.toDocument(props) },
      { upsert: true }
    );
    return props;
  }

  async reset() {
    await (await this.routes()).deleteMany({});
  }

  private async routes() {
    if (!this.collection) {
      const config = getMongoConfig();
      this.client = new MongoClient(config.uri, {
        serverSelectionTimeoutMS: config.serverSelectionTimeoutMS,
        connectTimeoutMS: config.connectTimeoutMS
      });
      await this.client.connect();
      this.collection = this.client
        .db(config.database)
        .collection<RouteDocument>(config.collection);
      void this.collection.createIndex({ status: 1 });
      void this.collection.createIndex({ createdAt: -1 });
    }

    return this.collection;
  }

  private toDocument(props: RouteProps): RouteDocument {
    return {
      ...props,
      _id: props.id
    };
  }

  private toProps(document: RouteDocument): RouteProps {
    const { _id: _id, ...props } = document;
    return props;
  }
}
