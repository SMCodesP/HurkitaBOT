const { Entity, Column, PrimaryColumn, Index } = require('typeorm')

@Entity()
class Anime {
  @PrimaryColumn()
  id: number

  @Index({ fulltext: true })
  @Column()
  category_name: string

  @Column()
  category_image: string

  @Column({
    nullable: true,
  })
  anilist_id?: number

  @Index({ fulltext: true })
  @Column({
    nullable: true,
  })
  title_romaji?: string

  @Index({ fulltext: true })
  @Column({
    nullable: true,
  })
  title_english?: string

  @Index({ fulltext: true })
  @Column({
    nullable: true,
  })
  title_native?: string

  @Index({ fulltext: true })
  @Column({
    nullable: true,
  })
  title_userPreferred?: string

  @Index({ fulltext: true })
  @Column({
    nullable: true,
  })
  sinopse: string

  @Column({
    nullable: true,
  })
  type?: string

  @Column({
    nullable: true,
  })
  format?: string

  @Column('varchar', { array: true, nullable: true })
  genres: string[]

  @Column({
    nullable: true,
  })
  bannerImage?: string

  @Column({
    nullable: true,
  })
  coverImage_extraLarge?: string

  @Column({
    nullable: true,
  })
  coverImage_large?: string

  @Column({
    nullable: true,
  })
  coverImage_medium?: string

  @Column({
    nullable: true,
  })
  coverImage_color?: string

  @Column()
  error: boolean
}

export { Anime }
