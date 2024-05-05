const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

const getAllUsers = async () => {
  return prisma.user.findMany();
};

const findUserByEmail = async (email) => {
  return prisma.user.findFirst({
    where: {
      email: email,
    },
  });
};

const findUserByNumberPhone = async (numberPhone) => {
  return prisma.user.findFirst({
    where: {
      numberPhone: numberPhone,
    },
  });
};

const findUserByEmailOrNumberPhone = async (emailOrNumberPhone) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          email: emailOrNumberPhone,
        },
        {
          numberPhone: emailOrNumberPhone,
        },
      ],
    },
  });
};

module.exports = {
  createUser,
  getAllUsers,
  findUserByEmail,
  findUserByNumberPhone,
  findUserByEmailOrNumberPhone,
};
