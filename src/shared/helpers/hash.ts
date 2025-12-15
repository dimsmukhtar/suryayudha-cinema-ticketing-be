import argon2 from 'argon2'

const run = async () => {
  const hash = await argon2.hash('jokerjoker')
  console.log(hash)
}

run()
