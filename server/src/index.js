import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  User,
  Post,
  Comment,
  Conversation,
  Message,
  Notification,
  Report,
  Story
} from './models/index.js';

import { auth, admin, sign } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  username: u.username,
  email: u.email,
  avatar: u.avatar,
  bio: u.bio,
  role: u.role,
  followers: u.followers?.length || 0,
  following: u.following?.length || 0
});

/* =========================================================
   HEALTH
========================================================= */

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'New India Connect API'
  });
});

/* =========================================================
   AUTH - SIGNUP
========================================================= */

app.post('/api/auth/signup', async (req, res) => {
  try {
    let {
      name,
      username,
      email,
      password
    } = req.body || {};

    name = String(name || '').trim();
    username = String(username || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_.]/g, '');

    email = String(email || '')
      .trim()
      .toLowerCase();

    password = String(password || '');

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message:
          'Name, username, email and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        message:
          'Username must be at least 3 characters'
      });
    }

    const existing = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (existing) {
      return res.status(409).json({
        message:
          'Email or username already exists'
      });
    }

    /*
      If ADMIN_EMAIL is configured in .env,
      that account becomes admin automatically.
    */
    const adminEmail =
      String(process.env.ADMIN_EMAIL || '')
        .trim()
        .toLowerCase();

    const role =
      adminEmail && email === adminEmail
        ? 'admin'
        : 'user';

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role
    });

    const token = sign(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      user: safeUser(user)
    });
  } catch (error) {
    console.error('SIGNUP ERROR:', error);

    return res.status(500).json({
      message:
        error.message || 'Signup failed'
    });
  }
});

/* =========================================================
   AUTH - LOGIN
========================================================= */

app.post('/api/auth/login', async (req, res) => {
  try {
    const login = String(
      req.body?.emailOrUsername ||
      req.body?.email ||
      req.body?.username ||
      ''
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body?.password || ''
    );

    if (!login || !password) {
      return res.status(400).json({
        message:
          'Email/username and password are required'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const token = sign(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      user: safeUser(user)
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message:
        error.message || 'Login failed'
    });
  }
});

/* =========================================================
   AUTH - LOGOUT / ME
========================================================= */

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');

  res.json({
    ok: true
  });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({
    user: safeUser(req.user)
  });
});

/* =========================================================
   ADMIN LOGIN
========================================================= */

app.post('/api/admin/login', async (req, res) => {
  try {
    const login = String(
      req.body?.email ||
      req.body?.username ||
      req.body?.emailOrUsername ||
      ''
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body?.password || ''
    );

    if (!login || !password) {
      return res.status(400).json({
        ok: false,
        message:
          'Admin username/email and password are required'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid admin credentials'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        ok: false,
        message: 'Admin access required'
      });
    }

    const passwordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordValid) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid admin credentials'
      });
    }

    const token = sign(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      ok: true,
      user: safeUser(user)
    });
  } catch (error) {
    console.error(
      'ADMIN LOGIN ERROR:',
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        error.message || 'Admin login failed'
    });
  }
});

/* =========================================================
   ADMIN LOGOUT / ME
========================================================= */

app.post(
  '/api/admin/logout',
  auth,
  admin,
  (req, res) => {
    res.clearCookie('token');

    res.json({
      ok: true
    });
  }
);

app.get(
  '/api/admin/me',
  auth,
  admin,
  (req, res) => {
    res.json({
      ok: true,
      user: safeUser(req.user)
    });
  }
);

/* =========================================================
   PROFILE
========================================================= */

app.patch(
  '/api/profile',
  auth,
  async (req, res) => {
    try {
      const {
        name,
        bio,
        avatar
      } = req.body || {};

      if (name !== undefined) {
        req.user.name =
          String(name).trim();
      }

      if (bio !== undefined) {
        req.user.bio =
          String(bio).trim();
      }

      if (avatar !== undefined) {
        req.user.avatar =
          String(avatar).trim();
      }

      await req.user.save();

      res.json({
        user: safeUser(req.user)
      });
    } catch (error) {
      console.error(
        'PROFILE UPDATE ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Profile update failed'
      });
    }
  }
);

/* =========================================================
   USERS SEARCH
========================================================= */

app.get(
  '/api/users/search',
  auth,
  async (req, res) => {
    try {
      const q = String(
        req.query.q || ''
      ).trim();

      if (!q) {
        return res.json({
          users: []
        });
      }

      const escaped =
        q.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        );

      const regex =
        new RegExp(escaped, 'i');

      const users =
        await User.find({
          $or: [
            { username: regex },
            { name: regex }
          ]
        }).limit(20);

      res.json({
        users: users.map(safeUser)
      });
    } catch (error) {
      console.error(
        'USER SEARCH ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'User search failed'
      });
    }
  }
);

/* =========================================================
   FOLLOW / UNFOLLOW
========================================================= */

app.post(
  '/api/users/:id/follow',
  auth,
  async (req, res) => {
    try {
      const target =
        await User.findById(
          req.params.id
        );

      if (!target) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      if (
        target._id.toString() ===
        req.user._id.toString()
      ) {
        return res.status(400).json({
          message:
            'You cannot follow yourself'
        });
      }

      const index =
        req.user.following.findIndex(
          (id) =>
            id.toString() ===
            target._id.toString()
        );

      if (index >= 0) {
        req.user.following.splice(
          index,
          1
        );

        target.followers.pull(
          req.user._id
        );
      } else {
        req.user.following.push(
          target._id
        );

        target.followers.push(
          req.user._id
        );

        await Notification.create({
          user: target._id,
          from: req.user._id,
          type: 'follow',
          text:
            `${req.user.username} started following you`
        });
      }

      await req.user.save();
      await target.save();

      res.json({
        following: index < 0
      });
    } catch (error) {
      console.error(
        'FOLLOW ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Follow action failed'
      });
    }
  }
);

/* =========================================================
   POSTS
========================================================= */

app.get(
  '/api/posts',
  auth,
  async (req, res) => {
    try {
      const posts =
        await Post.find()
          .sort({
            createdAt: -1
          })
          .limit(50)
          .populate(
            'author',
            'name username avatar'
          );

      const comments =
        await Comment.aggregate([
          {
            $group: {
              _id: '$post',
              count: {
                $sum: 1
              }
            }
          }
        ]);

      const commentMap =
        new Map(
          comments.map(
            (item) => [
              item._id.toString(),
              item.count
            ]
          )
        );

      const currentUserId =
        req.user._id.toString();

      const result =
        posts.map((post) => {
          const obj =
            post.toObject();

          return {
            ...obj,
            id: post._id,
            liked: post.likes.some(
              (id) =>
                id.toString() ===
                currentUserId
            ),
            saved:
              post.savedBy.some(
                (id) =>
                  id.toString() ===
                  currentUserId
              ),
            likes:
              post.likes.length,
            comments:
              commentMap.get(
                post._id.toString()
              ) || 0
          };
        });

      res.json({
        posts: result
      });
    } catch (error) {
      console.error(
        'GET POSTS ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load posts'
      });
    }
  }
);

app.post(
  '/api/posts',
  auth,
  upload.single('image'),
  async (req, res) => {
    try {
      const image =
        req.file
          ? `/uploads/${req.file.filename}`
          : String(
              req.body?.image || ''
            );

      const post =
        await Post.create({
          author: req.user._id,
          image,
          caption:
            String(
              req.body?.caption || ''
            ).trim(),
          location:
            String(
              req.body?.location || ''
            ).trim()
        });

      await post.populate(
        'author',
        'name username avatar'
      );

      res.status(201).json({
        post
      });
    } catch (error) {
      console.error(
        'CREATE POST ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not create post'
      });
    }
  }
);

/* =========================================================
   LIKE POST
========================================================= */

app.post(
  '/api/posts/:id/like',
  auth,
  async (req, res) => {
    try {
      const post =
        await Post.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message: 'Post not found'
        });
      }

      const userId =
        req.user._id.toString();

      const hasLiked =
        post.likes.some(
          (id) =>
            id.toString() === userId
        );

      if (hasLiked) {
        post.likes.pull(
          req.user._id
        );
      } else {
        post.likes.push(
          req.user._id
        );

        if (
          post.author.toString() !==
          userId
        ) {
          await Notification.create({
            user: post.author,
            from: req.user._id,
            type: 'like',
            post: post._id,
            text:
              `${req.user.username} liked your post`
          });
        }
      }

      await post.save();

      res.json({
        liked: !hasLiked,
        likes:
          post.likes.length
      });
    } catch (error) {
      console.error(
        'LIKE ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Like failed'
      });
    }
  }
);

/* =========================================================
   SAVE POST
========================================================= */

app.post(
  '/api/posts/:id/save',
  auth,
  async (req, res) => {
    try {
      const post =
        await Post.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message: 'Post not found'
        });
      }

      const userId =
        req.user._id.toString();

      const hasSaved =
        post.savedBy.some(
          (id) =>
            id.toString() === userId
        );

      if (hasSaved) {
        post.savedBy.pull(
          req.user._id
        );
      } else {
        post.savedBy.push(
          req.user._id
        );
      }

      await post.save();

      res.json({
        saved: !hasSaved
      });
    } catch (error) {
      console.error(
        'SAVE ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Save failed'
      });
    }
  }
);

/* =========================================================
   COMMENTS
========================================================= */

app.get(
  '/api/posts/:id/comments',
  auth,
  async (req, res) => {
    try {
      const comments =
        await Comment.find({
          post: req.params.id
        })
          .sort({
            createdAt: -1
          })
          .populate(
            'author',
            'name username avatar'
          );

      res.json({
        comments
      });
    } catch (error) {
      console.error(
        'GET COMMENTS ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load comments'
      });
    }
  }
);

app.post(
  '/api/posts/:id/comments',
  auth,
  async (req, res) => {
    try {
      const text =
        String(
          req.body?.text || ''
        ).trim();

      if (!text) {
        return res.status(400).json({
          message:
            'Comment cannot be empty'
        });
      }

      const post =
        await Post.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message: 'Post not found'
        });
      }

      const comment =
        await Comment.create({
          post: post._id,
          author: req.user._id,
          text
        });

      await comment.populate(
        'author',
        'name username avatar'
      );

      if (
        post.author.toString() !==
        req.user._id.toString()
      ) {
        await Notification.create({
          user: post.author,
          from: req.user._id,
          type: 'comment',
          post: post._id,
          text:
            `${req.user.username} commented on your post`
        });
      }

      res.status(201).json({
        comment
      });
    } catch (error) {
      console.error(
        'COMMENT ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Comment failed'
      });
    }
  }
);

/* =========================================================
   NOTIFICATIONS
========================================================= */

app.get(
  '/api/notifications',
  auth,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          user: req.user._id
        })
          .sort({
            createdAt: -1
          })
          .limit(50)
          .populate(
            'from',
            'name username avatar'
          );

      res.json({
        notifications
      });
    } catch (error) {
      console.error(
        'NOTIFICATIONS ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load notifications'
      });
    }
  }
);

/* =========================================================
   STORIES
========================================================= */

app.post(
  '/api/stories',
  auth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            'Story image is required'
        });
      }

      const story =
        await Story.create({
          author: req.user._id,
          image:
            `/uploads/${req.file.filename}`,
          caption:
            String(
              req.body?.caption || ''
            ).trim(),
          expiresAt:
            new Date(
              Date.now() +
                24 * 60 * 60 * 1000
            )
        });

      res.status(201).json({
        story
      });
    } catch (error) {
      console.error(
        'CREATE STORY ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Story creation failed'
      });
    }
  }
);

app.get(
  '/api/stories',
  auth,
  async (req, res) => {
    try {
      const stories =
        await Story.find({
          expiresAt: {
            $gt: new Date()
          }
        })
          .sort({
            createdAt: -1
          })
          .populate(
            'author',
            'name username avatar'
          );

      res.json({
        stories
      });
    } catch (error) {
      console.error(
        'GET STORIES ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load stories'
      });
    }
  }
);

/* =========================================================
   MESSAGES / CONVERSATIONS
========================================================= */

app.get(
  '/api/messages/conversations',
  auth,
  async (req, res) => {
    try {
      const conversations =
        await Conversation.find({
          members: req.user._id
        })
          .sort({
            updatedAt: -1
          })
          .populate(
            'members',
            'name username avatar'
          );

      res.json({
        conversations
      });
    } catch (error) {
      console.error(
        'GET CONVERSATIONS ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load conversations'
      });
    }
  }
);

app.post(
  '/api/messages/conversations',
  auth,
  async (req, res) => {
    try {
      const other =
        await User.findById(
          req.body?.userId
        );

      if (!other) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      let conversation =
        await Conversation.findOne({
          isGroup: false,
          members: {
            $all: [
              req.user._id,
              other._id
            ],
            $size: 2
          }
        }).populate(
          'members',
          'name username avatar'
        );

      if (!conversation) {
        conversation =
          await Conversation.create({
            members: [
              req.user._id,
              other._id
            ]
          });

        await conversation.populate(
          'members',
          'name username avatar'
        );
      }

      res.json({
        conversation
      });
    } catch (error) {
      console.error(
        'CREATE CONVERSATION ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not create conversation'
      });
    }
  }
);

app.get(
  '/api/messages/:id',
  auth,
  async (req, res) => {
    try {
      const conversation =
        await Conversation.findOne({
          _id: req.params.id,
          members: req.user._id
        });

      if (!conversation) {
        return res.status(403).json({
          message: 'Not a member'
        });
      }

      const messages =
        await Message.find({
          conversation:
            conversation._id
        })
          .sort({
            createdAt: 1
          })
          .populate(
            'sender',
            'name username avatar'
          );

      res.json({
        messages
      });
    } catch (error) {
      console.error(
        'GET MESSAGES ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load messages'
      });
    }
  }
);

app.post(
  '/api/messages/:id',
  auth,
  async (req, res) => {
    try {
      const conversation =
        await Conversation.findOne({
          _id: req.params.id,
          members: req.user._id
        });

      if (!conversation) {
        return res.status(403).json({
          message: 'Not a member'
        });
      }

      const text =
        String(
          req.body?.text || ''
        ).trim();

      if (!text) {
        return res.status(400).json({
          message:
            'Message cannot be empty'
        });
      }

      const message =
        await Message.create({
          conversation:
            conversation._id,
          sender:
            req.user._id,
          text
        });

      conversation.updatedAt =
        new Date();

      await conversation.save();

      await message.populate(
        'sender',
        'name username avatar'
      );

      res.status(201).json({
        message
      });
    } catch (error) {
      console.error(
        'SEND MESSAGE ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Message sending failed'
      });
    }
  }
);

/* =========================================================
   REPORTS
========================================================= */

app.post(
  '/api/reports',
  auth,
  async (req, res) => {
    try {
      const report =
        await Report.create({
          reporter:
            req.user._id,
          targetType:
            req.body?.targetType,
          targetId:
            req.body?.targetId,
          reason:
            String(
              req.body?.reason ||
              'Reported by user'
            ).trim()
        });

      res.status(201).json({
        ok: true,
        report
      });
    } catch (error) {
      console.error(
        'REPORT ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Report failed'
      });
    }
  }
);

/* =========================================================
   ADMIN - STATS
========================================================= */

app.get(
  '/api/admin/stats',
  auth,
  admin,
  async (req, res) => {
    try {
      const [
        users,
        posts,
        comments,
        reports,
        messages
      ] = await Promise.all([
        User.countDocuments(),
        Post.countDocuments(),
        Comment.countDocuments(),
        Report.countDocuments({
          status: 'open'
        }),
        Message.countDocuments()
      ]);

      res.json({
        users,
        posts,
        comments,
        reports,
        messages
      });
    } catch (error) {
      console.error(
        'ADMIN STATS ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load admin stats'
      });
    }
  }
);

/* =========================================================
   ADMIN - USERS
========================================================= */

app.get(
  '/api/admin/users',
  auth,
  admin,
  async (req, res) => {
    try {
      const users =
        await User.find()
          .sort({
            createdAt: -1
          })
          .limit(100);

      res.json({
        users: users.map(safeUser)
      });
    } catch (error) {
      console.error(
        'ADMIN USERS ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load admin users'
      });
    }
  }
);

/* =========================================================
   ADMIN - CHANGE ROLE
========================================================= */

app.patch(
  '/api/admin/users/:id/role',
  auth,
  admin,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      user.role =
        req.body?.role === 'admin'
          ? 'admin'
          : 'user';

      await user.save();

      res.json({
        user: safeUser(user)
      });
    } catch (error) {
      console.error(
        'ADMIN ROLE ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not change role'
      });
    }
  }
);

/* =========================================================
   ADMIN - REPORTS
========================================================= */

app.get(
  '/api/admin/reports',
  auth,
  admin,
  async (req, res) => {
    try {
      const reports =
        await Report.find()
          .sort({
            createdAt: -1
          })
          .populate(
            'reporter',
            'username email'
          );

      res.json({
        reports
      });
    } catch (error) {
      console.error(
        'ADMIN REPORTS ERROR:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Could not load reports'
      });
    }
  }
);

/* =========================================================
   404 API HANDLER
========================================================= */

app.use('/api', (req, res) => {
  res.status(404).json({
    ok: false,
    message:
      `API route not found: ${req.method} ${req.originalUrl}`
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (err, req, res, next) => {
    console.error(
      'SERVER ERROR:',
      err
    );

    if (res.headersSent) {
      return next(err);
    }

    res.status(
      err.status || 500
    ).json({
      ok: false,
      message:
        err.message ||
        'Server error'
    });
  }
);

/* =========================================================
   MONGODB + SERVER
========================================================= */

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/new_india_connect';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log(
      'MongoDB connected'
    );

    /*
      Automatically promote ADMIN_EMAIL
      if that user already exists.
    */
    const adminEmail =
      String(
        process.env.ADMIN_EMAIL || ''
      )
        .trim()
        .toLowerCase();

    if (adminEmail) {
      const adminUser =
        await User.findOne({
          email: adminEmail
        });

      if (
        adminUser &&
        adminUser.role !== 'admin'
      ) {
        adminUser.role = 'admin';
        await adminUser.save();

        console.log(
          `Admin role assigned to ${adminEmail}`
        );
      }
    }

    app.listen(
      PORT,
      () => {
        console.log(
          `API running on http://localhost:${PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      'MongoDB connection failed:',
      error.message
    );

    process.exit(1);
  });