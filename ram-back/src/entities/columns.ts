// (c) Delta Software 2023, rights reserved.

import { ColumnOptions } from "typeorm";

export const NAME_COLUMN: ColumnOptions = {
  name: "name",
  type: "varchar",
  length: 255,
  nullable: false,
};

export const CUSTOM_NAME_COLUMN: ColumnOptions = {
  name: "custom_name",
  type: "varchar",
  length: 255,
  nullable: false,
};
export const LAST_NAME_COLUMN: ColumnOptions = {
  name: "last_name",
  type: "varchar",
  length: 255,
  nullable: false,
};

export const UNIQUE_AGENT_KEY_COLUMN: ColumnOptions = {
  name: "unique_agent_key",
  type: "varchar",
  length: 255,
  nullable: false,
};

export const UNIQUE_NAME_COLUMN: ColumnOptions = {
  name: "name",
  type: "varchar",
  length: 255,
  nullable: false,
  unique: true,
};

export const REQUIRED_STRING_COLUMN = (
  name: string,
  {
    defaultValue,
  }: {
    defaultValue?: string;
  } = {},
): ColumnOptions => ({
  name,
  type: "varchar",
  length: 255,
  nullable: false,
  default: defaultValue,
});

export const ID_STRING_COLUMN = (name: string): ColumnOptions => ({
  name,
  type: "varchar",
  length: 255,
  primary: true,
  unique: true,
  default: "uuid_generate_v4()",
});

export const DESCRIPTION_COLUMN: ColumnOptions = {
  type: "varchar",
  length: 255,
  nullable: true,
};

export const TELEPHONE_COLUMN: ColumnOptions = {
  type: "varchar",
  length: 20,
  nullable: true,
};

export const DATE_COLUMN: ColumnOptions = {
  type: "date",
  nullable: true,
};

export const REQUIRED_DATE_COLUMN: ColumnOptions = {
  type: "date",
  nullable: false,
};

export const URL_COLUMN: ColumnOptions = {
  type: "varchar",
  length: 255,
  nullable: true,
};

export const USERNAME_COLUMN: ColumnOptions = {
  type: "varchar",
  length: 255,
  nullable: false,
  unique: true,
};

export const PASSWORD_COLUMN: ColumnOptions = {
  type: "varchar",
  length: 255,
  nullable: false,
};

export const POLICY_NUMBER_COLUMN: ColumnOptions = {
  type: "varchar",
  length: 255,
  nullable: false,
};

export const MONEY_COLUMN: ColumnOptions = {
  type: "int",
  nullable: false,
};

export const ID_COLUMN = (
  name: string,
  {
    nullable = false,
    primary = true,
  }: {
    nullable?: boolean;
    primary?: boolean;
  } = {},
): ColumnOptions => ({
  name,
  type: "uuid",
  nullable,
  primary,
});

export const IS_ACTIVE_COLUMN: ColumnOptions = {
  type: "int",
  nullable: false,
  default: 1,
};

export const BOOLEAN_COLUMN: ColumnOptions = {
  type: "int",
  nullable: true,
  default: 1,
};
