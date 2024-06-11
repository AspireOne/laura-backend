import { Inject, Injectable } from "@nestjs/common";
import { CreateFucksGivenDto } from "./dto/create-fucks-given.dto";
import { UpdateFucksGivenDto } from "./dto/update-fucks-given.dto";
import { DB } from "kysely-codegen";
import { Kysely } from "kysely";

@Injectable()
export class FucksGivenService {
  constructor(@Inject("Database") private readonly db: Kysely<DB>) {}

  async create(createFucksGivenDto: CreateFucksGivenDto) {
    return await this.db
      .insertInto("fucks_given")
      .values(createFucksGivenDto)
      .returningAll()
      .execute();
  }

  async findAll() {
    return await this.db.selectFrom("fucks_given").limit(100).selectAll().execute();
  }

  async findOne(id: number) {
    return await this.db
      .selectFrom("fucks_given")
      .selectAll()
      .where("id", "=", id)
      .execute();
  }

  async update(id: number, updateFucksGivenDto: UpdateFucksGivenDto) {
    return await this.db
      .updateTable("fucks_given")
      .set({
        content: updateFucksGivenDto.content,
      })
      .where("id", "=", id)
      .returningAll()
      .execute();
  }

  async remove(id: number) {
    return await this.db
      .deleteFrom("fucks_given")
      .where("id", "=", id)
      .returningAll()
      .execute();
  }
}
