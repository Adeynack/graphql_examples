import { Post, PrismaClient, User } from '@prisma/client';
import { generatePasswordDigest } from '../../src/models/user.js';
import * as YAML from 'yaml';
import { readFileSync } from 'fs';

export async function seedDevelopment(db: PrismaClient): Promise<void> {
  // const file = readFileSync('/workspaces/graphql_examples/examples/rails/test/fixtures/files/users.yml', 'utf8');
  const users = new Map<string, User>();
  for (const fixtureName in YAML.parse(readFileSync('../rails/test/fixtures/users.yml', 'utf8'))) {
    const userFixture = YAML.parse(readFileSync('../rails/test/fixtures/users.yml', 'utf8'))[fixtureName];
    const user = await db.user.create({
      data: {
        email: userFixture.email,
        name: userFixture.name,
        passwordDigest: generatePasswordDigest(userFixture.name),
      },
    });
    users.set(userFixture.name, user);
  }

  // const joe = await db.user.create({
  //   data: { email: 'joe@example.com', name: 'Joe', passwordDigest: generatePasswordDigest('joe') },
  // });
  // const linda = await db.user.create({
  //   data: { email: 'linda@example.com', name: 'Linda', passwordDigest: generatePasswordDigest('linda') },
  // });
  // const joe = await upsertUser(db, { email: 'joe@example.com', name: 'Joe', password: 'joe' });
  // const linda = await upsertUser(db, { email: 'linda@example.com', name: 'Linda', password: 'linda' });

  // await upsertPost(db, {
  //   id: '2e3dec43-a9cb-4ba9-a4ae-8290025dbaf1',
  //   author: joe,
  //   text: 'Have you guys seen the new Star Trek series?',
  // });
  // await upsertPost(db, {
  //   id: '2e3dec43-a9cb-4ba9-a4ae-8290025dbaf1',
  //   author: joe,
  //   text: 'Have you guys seen the new Star Trek series?',
  // });
  // startrek_comment_1:
  //   author: linda
  //   parent: startrek
  //   text: Yep, and I did not like it 😴
  //   created_at: "2020-09-15T23:36:00Z"
  //   updated_at: "2020-09-15T23:36:00Z"
  // startrek_comment_2:
  //   author: joe
  //   parent: startrek
  //   text: Awww, come on!!! Give it a chance!
  //   created_at: "2020-09-15T23:37:00Z"
  //   updated_at: "2020-09-15T23:37:00Z"
  // b5:
  //   author: linda
  //   text: Awwww, I so miss Babylon 5!
  //   created_at: "2020-09-15T20:37:00Z"
  //   updated_at: "2020-09-15T20:37:00Z"
  // b5_comment_1:
  //   author: joe
  //   parent: b5
  //   text: Guuuuurl ... me too !!!!
  //   created_at: "2020-09-15T20:38:00Z"
  //   updated_at: "2020-09-15T20:38:00Z"
  // b5_comment_2:
  //   author: joe
  //   parent: b5
  //   text: They do not make them as good as that anymore.
  //   created_at: "2020-09-15T20:39:00Z"
  //   updated_at: "2020-09-15T20:39:00Z"
  // b5_comment_3:
  //   author: linda
  //   parent: b5
  //   text: True...!
  //   created_at: "2020-09-15T20:40:00Z"
  //   updated_at: "2020-09-15T20:40:00Z"
}

function upsertUser(db: PrismaClient, user: { email: string; name: string; password: string }): Promise<User> {
  const data = { ...user, passwordDigest: generatePasswordDigest(user.password) };
  return db.user.upsert({
    where: { email: user.email },
    update: data,
    create: data,
  });
}

function upsertPost(db: PrismaClient, post: { id: string; text: string; author: User }): Promise<Post> {
  const data = { text: post.text, authorId: post.author.id };
  return db.post.upsert({
    where: { id: post.id },
    update: data,
    create: { id: post.id, ...data },
  });
}
