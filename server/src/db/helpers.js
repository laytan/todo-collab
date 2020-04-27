function addDefaultColumns(table) {
  table.increments('id');
  table.timestamps(true, true);
  table.integer('status').defaultTo(1);
}

function references(table, referenceTable, columnName) {
  return table.integer(`${columnName}_id`)
    .unsigned()
    .references('id')
    .inTable(referenceTable)
    .onDelete('cascade');
}

module.exports = {
  addDefaultColumns,
  references,
};
