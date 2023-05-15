import request from 'supertest';
import { app } from '../../controller';

describe('prospectRouter', () => {
  describe('GET /count-prospects-new/:id', () => {
    it('returns the number of new prospects for the given user ID', async () => {
      // Primero, asegurémonos de que la ruta esté funcionando correctamente en el servidor
      const response = await request(app).get('/prospects/count-prospects-new/1');
      expect(response.status).toBe(200);

      // Ahora, simulemos una llamada a la ruta y verifiquemos la respuesta
      const res = await request(app).get('/prospects/count-prospects-new/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('count');
      expect(typeof res.body.count).toBe('number');
    });

    it('returns a 404 error if the user ID is not found', async () => {
      const res = await request(app).get('/prospects/count-prospects-new/999');
      expect(res.status).toBe(404);
    });
  });
});