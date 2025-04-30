import { PrismaClient } from '@prisma/client';
import scrape from '../scrapData';

// const getData = async () => {
//     const prisma = new PrismaClient();
//     const user = await prisma.user.findMany()
//     console.log(user)
// }
// getData()

scrape()