import { Post, PrismaClient, User, Emotion } from '@prisma/client';
import { generatePasswordDigest } from '../../src/models/user.js';
import * as YAML from 'yaml';
import { readFileSync } from 'fs';

export async function seedDevelopment(db: PrismaClient, serverSalt: string): Promise<void> {
  // There is probably a more Prisma-pragmatic way of doing it, but since I want to
  // reuse the same data in all examples, this loads the fixtures from the "rails" example.
  const users = await createUsers(db, serverSalt, loadFixtures('users'));
  const posts = await createPosts(db, loadFixtures('posts'), users);
  await createReactions(db, loadFixtures('reactions'), users, posts);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadFixtures(name: string): any {
  return YAML.parse(readFileSync(`../rails/test/fixtures/${name}.yml`, 'utf8'));
}

type UserFixture = {
  email: string;
  name: string;
};

async function createUsers(
  db: PrismaClient,
  serverSalt: string,
  fixtures: Record<string, UserFixture>
): Promise<Map<string, User>> {
  const users = new Map<string, User>();

  for (const [fixtureName, userFixture] of Object.entries(fixtures)) {
    users.set(
      fixtureName,
      await db.user.create({
        data: {
          email: userFixture.email,
          name: userFixture.name,
          passwordDigest: generatePasswordDigest(serverSalt, userFixture.name),
        },
      })
    );
  }

  return users;
}

type PostFixture = {
  author: string; // fixture name
  parent: string; // fixture name
  text: string;
  created_at: string;
  updated_at: string;
};

async function createPosts(
  db: PrismaClient,
  fixtures: Record<string, PostFixture>, // | Map<string, PostFixture>,
  users: Map<string, User>,
  posts: Map<string, Post> = new Map()
): Promise<Map<string, Post>> {
  let postsCreated = false;
  const nextLevelPostFixtures: Record<string, PostFixture> = {};
  for (const [fixtureName, fixture] of Object.entries(fixtures)) {
    let parent: Post | undefined = undefined;
    if (fixture.parent) {
      parent = posts.get(fixture.parent);
      if (!parent) {
        nextLevelPostFixtures[fixtureName] = fixture;
        continue;
      }
    }

    const author = users.get(fixture.author);
    if (!author) throw new Error('author not found');

    const post = await db.post.create({
      data: {
        authorId: author.id,
        createdAt: fixture.created_at,
        updatedAt: fixture.updated_at,
        parentId: parent?.id,
        text: fixture.text,
      },
    });
    posts.set(fixtureName, post);
    postsCreated = true;
  }

  if (!postsCreated) {
    throw new Error('no post were created (maybe invalid parent reference)');
  }

  if (Object.getOwnPropertyNames(nextLevelPostFixtures).length > 0) {
    await createPosts(db, nextLevelPostFixtures, users, posts);
  }

  return posts;
}

type ReactionFixture = {
  user: string; // fixture name
  post: string; // fixture name
  emotion: Emotion;
};

async function createReactions(
  db: PrismaClient,
  fixtures: Record<string, ReactionFixture>,
  users: Map<string, User>,
  posts: Map<string, Post>
): Promise<void> {
  for (const fixture of Object.values(fixtures)) {
    const user = users.get(fixture.user);
    if (!user) throw new Error(`unknown user fixture '${fixture.user}`);

    const post = posts.get(fixture.post);
    if (!post) throw new Error(`unknown post fixture '${fixture.post}`);

    await db.reaction.create({
      data: {
        userId: user.id,
        postId: post.id,
        emotion: fixture.emotion,
      },
    });
  }
}
