import 'dotenv/config';
import { MongoClient } from 'mongodb';

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria nao encontrada: ${name}`);
  }

  return value;
}

function maskMongoUri(uri: string) {
  try {
    const parsed = new URL(uri);

    if (parsed.username) {
      parsed.username = '***';
    }

    if (parsed.password) {
      parsed.password = '***';
    }

    return parsed.toString();
  } catch {
    return '(URI invalida ou nao exibivel)';
  }
}

async function main() {
  const uri = getRequiredEnv('MONGODB_URI');
  const databaseName = getRequiredEnv('MONGODB_DATABASE');
  const startedAt = Date.now();

  console.log('Testando conexao com MongoDB...');
  console.log(`URI: ${maskMongoUri(uri)}`);
  console.log(`Database: ${databaseName}`);
  console.log('');

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS ?? 15000),
    connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS ?? 15000)
  });

  try {
    await client.connect();

    const database = client.db(databaseName);
    const ping = await database.command({ ping: 1 });
    const collections = await database
      .listCollections({}, { nameOnly: true })
      .toArray();

    const elapsedMs = Date.now() - startedAt;

    console.log('Conexao realizada com sucesso.');
    console.log(`Resultado do ping: ${ping.ok}`);
    console.log(`Collections encontradas: ${collections.length}`);

    if (collections.length > 0) {
      console.log(`Amostra: ${collections.slice(0, 5).map((collection) => collection.name).join(', ')}`);
    } else {
      console.log('Amostra: nenhuma collection encontrada nesse database.');
    }

    console.log(`Tempo total: ${elapsedMs}ms`);
  } catch (error) {
    console.error('Falha ao conectar no MongoDB.');

    if (error instanceof Error) {
      console.error(`Mensagem: ${error.message}`);
    } else {
      console.error(error);
    }

    console.error('');
    console.error('Confira MONGODB_URI, MONGODB_DATABASE, usuario/senha, IP liberado no MongoDB Atlas e conectividade da rede.');
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

void main();
