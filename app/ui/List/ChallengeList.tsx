"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Divider,
  Chip,
} from "@nextui-org/react"
import { IoMdPerson } from "react-icons/io"
import Link from "next/link"
import { get_challenges } from "@/app/utils/service/challenge"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ChallengeMainResponseDto } from "@/app/utils/types/challenge"
import dayjs from "dayjs"

export default function ChallengeList() {
  const [page, setPage] = useState(0)
  const [challenges, setChallenges] = useState<ChallengeMainResponseDto[]>([])
  const [totalPageCount, setTotalPageCount] = useState<number | null>(null)

  const getChallenges = async (pageParam: number) => {
    const { data } = await get_challenges({ page: pageParam })
    if (data.result) {
      setChallenges((prevChallenges) => [...prevChallenges, ...data.result])
      setTotalPageCount(data.metadata.totalPageCount)
      if (data.metadata.totalPageCount > page) {
        setPage((prevPage) => prevPage + 1)
      }
      console.log(data)
    }
  }

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["challenges"],
    queryFn: ({ pageParam }) => getChallenges(pageParam),
    initialPageParam: 0,
    getNextPageParam: () => {
      if (totalPageCount && page === totalPageCount) return null
      return page
    },
    getPreviousPageParam: () => {
      if (page === 0) return null
      return page - 1
    },
  })

  useEffect(() => {
    fetchNextPage()
  }, [])

  console.log({ challenges, page, totalPageCount })

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {challenges.map(
        ({
          id,
          title,
          challengeCreatedAt,
          description,
          thumbnailImageUrl,
          hashtags,
        }) => (
          <Link key={id} href={`./challenges/${id}`}>
            <Card shadow="sm" className="pb-4">
              <Image
                aria-hidden
                alt={title}
                className="aspect-[5/3] object-cover rounded-b-none"
                src={thumbnailImageUrl || "/skelleton.png"}
              />
              <CardHeader className="reletive overflow-visible py-0">
                <Chip
                  startContent={<IoMdPerson size="16" />}
                  className="flex absolute top-3 right-2 z-20"
                  color="primary"
                >
                  {/* TODO: BE members */}
                  100
                </Chip>
              </CardHeader>
              <CardBody className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="w-full pb-3">
                  <div className="w-full flex justify-between items-center">
                    <h4 className="font-bold text-large">{title}</h4>
                    <p className="text-tiny text-default-500">
                      {dayjs(challengeCreatedAt).format("YYYY-MM-DD")}
                    </p>
                  </div>
                </div>
                <Divider />
                <div className="w-full pt-3 truncate">
                  <p className="truncate">{description}</p>
                </div>
                <div className="w-full select-none flex overflow-x-scroll pt-3">
                  {hashtags &&
                    hashtags.map((tag) => (
                      <Chip key={tag} variant="bordered" className="mr-1">
                        #{tag}
                      </Chip>
                    ))}
                </div>
              </CardBody>
            </Card>
          </Link>
        ),
      )}
    </div>
  )
}
