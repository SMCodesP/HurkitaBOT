import axios from 'axios'

export default async function getId(playername: string): Promise<string> {
  try {
    const { data: user } = await axios.get(
      `https://api.mojang.com/users/profiles/minecraft/${playername}`
    )

    return user.id
  } catch (error) {
    throw new Error('UUID error fetch.')
  }
}
