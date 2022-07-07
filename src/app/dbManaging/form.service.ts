import { Injectable } from '@angular/core';
import {Form, FormField, Field} from "../form/form-types";
import {db} from "../../db";
import {DBRequest, KeyValue} from "./types";
import {IndexableType} from "dexie";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  static async getAll() {
    const forms = await db.forms.toArray();

    return forms || [];
  }

  static async getByName(req: DBRequest): Promise<Form | null> {
    const form = await db.forms.where('name').equals(req.params['name']).toArray();
    console.log(await this.getAll());

    if (form.length > 0)
      return form[0];
    else
      return null;
  }

  static async getById(req: DBRequest) {
    const form = await db.forms.get((e: KeyValue) => e['id'] === req.params['id']);
    console.log(await this.getAll());

    if (form)
      return form;
    else
      throw 'form not found'
  }

  static async create(form: Form): Promise<IndexableType> {
    let foundForm = await this.getByName({params: form});

    if (foundForm)
      throw "this Form is exist!"

    const cmd: Form = {
      name: form.name,
      displayName: form.displayName,
      accessLevel: form.accessLevel,
      fields: form.fields,
    }

    try {
      return await db.forms.add(cmd);
    } catch (error) {
      throw error;
    }
  }

  static async update(id: number, form: Form): Promise<void> {
    const cmd: Form = {
      name: form.name,
      displayName: form.displayName,
      accessLevel: form.accessLevel,
      fields: form.fields,
    }
    try {
      await db.forms.update(id, cmd); // 0 or 1 return
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await db.forms.delete(id); // 0 or 1 return
    } catch (error) {
      throw error;
    }
  }

}