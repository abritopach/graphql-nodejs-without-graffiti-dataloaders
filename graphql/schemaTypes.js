import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';


// Importamos los modelos que hemos generado anteriormente, ya que los necesitaremos para detallar las consultas que se
// han de realizar a base de datos para recuperar los datos que necesitemos.
import { UserModel, PostModel, CommentModel } from '../models'

const User = new GraphQLObjectType({
    name: 'User',
    description: 'General user of the app',

    fields: () => ({
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        id: { type: GraphQLString },
        contacts: {
            type: new GraphQLList(User),
            resolve: user => UserModel.find({
                '_id': { $in: user.contacts }
            }, (_ , values) => values)
        },
        posts: {
            type: new GraphQLList(Post),
            resolve: user => PostModel.find({
                '_id': { $in: user.posts }
            },(_, values) => values)
        },
        comments: {
            type: new GraphQLList(Comment),
            resolve: user => CommentModel.find({
                '_id': { $in: user.comments }
            }, (_, values) => values)
        }
    })
});

const UsersSchema = {
    type: new GraphQLList(User),
    args: {
        firstName: { type: GraphQLString },
        lastName:{ type: GraphQLString }
    },
    resolve: (root, args) => UserModel.find(args, (_, values) => values)
}

const UserSchema = {
    type: User,
    args: {
        id: { type: GraphQLString },
        email:{ type: GraphQLString }
    },
    resolve: (root, args) => UserModel.findOne(args, (_, value) => value)
}

const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'Each content of the blog',

    fields: () => ({
        title: { type: GraphQLString },
        content : { type: GraphQLString },
        category : { type: GraphQLString },
        id: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        modifiedAt: { type: GraphQLString },
        comments: {
            type: new GraphQLList(Comment),
            resolve: post => CommentModel.find({
                'post': post._id
            }, (_, values) => values)
        },
        author: {
            type: User,
            resolve: (post, args) => UserModel.findOne(
                {
                    '_id': post.author
                },
                (_, value) => value)
        }
    })
});

const PostsSchema = {
    type: new GraphQLList(Post),
    args: {
        id: { type: GraphQLString },
        category: { type: GraphQLString}
    },
    resolve: (root, args) => PostModel.find(args, (_, values) => values)
}

const PostSchema = {
    type: Post,
    args: {
        id: { type: GraphQLString }
    },
    resolve: (root, args) => PostModel.findOne(args, (_, value) => value)
}

const Comment = new GraphQLObjectType({
    name: 'Comment',
    description: 'Comment',

    fields: () => ({
        comment: { type: GraphQLString },
        id: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        modifiedAt: { type: GraphQLString },
        likes: {
            type: new GraphQLList(User),
            resolve: comment => UserModel.find({
                '_id': { $in: comment.likes }
            }, (_, values) => values)
        },
        author: {
            type: User,
            resolve: (comment, args) => UserModel.findOne(
                {
                    '_id': comment.author
                },
                (_, value) => value)
        },
        post: {
            type: Post,
            resolve: (comment, args) => PostModel.findOne(
                {
                    '_id': comment.post
                },
                (_, value) => value)
        }
    })
});

const CommentsSchema = {
    type: new GraphQLList(Comment),
    args: {
        author: { type: GraphQLString },
        post: { type: GraphQLString }
    },
    resolve: (root, args) => CommentModel.find(args, (_, values) => values)
}

const CommentSchema = {
    type: Comment,
    args: {
        id: { type: GraphQLString }
    },
    resolve: (root, args) => CommentModel.findOne(args, (_, value) => value)
}

export { User, UserSchema, UsersSchema, Post, PostSchema, PostsSchema, Comment, CommentSchema, CommentsSchema };
