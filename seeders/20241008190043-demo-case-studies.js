'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('case_studies', [
      {
        title: 'Case Study A',
        description: 'Описание кейса A',
        image: 'caseA_image.png',
        customer_id: 1,
        created_at: new Date()
      },
      {
        title: 'Case Study B',
        description: 'Описание кейса B',
        image: 'caseB_image.png',
        customer_id: 2,
        created_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('case_studies', null, {});
  }
};
