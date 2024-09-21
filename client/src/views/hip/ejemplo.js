import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

const reportData = {
  "id": "5bf9e3bf-b9f9-4087-adfa-81c7f3309a29",
  "name": "Informe 5bf9e3bf-b9f9-4087-adfa-81c7f3309a29",
  "createdDate": "2024-09-14 22:41:33",
  "mediciones": [
    {
      "name": "Sector Acetabular",
      "angulos": [
        {
          "name": "Proximal",
          "path": "/placeholder.svg?height=300&width=400",
          "izquierdo": [
            { "name": "aasa", "value": 121 },
            { "name": "pasa", "value": -121 },
            { "name": "hasa", "value": 242 }
          ],
          "derecho": [
            { "name": "aasa", "value": 113 },
            { "name": "pasa", "value": -123 },
            { "name": "hasa", "value": 236 }
          ]
        },
        {
          "name": "Intermedial",
          "path": "/placeholder.svg?height=300&width=400",
          "izquierdo": [
            { "name": "aasa", "value": 109 },
            { "name": "pasa", "value": -108 },
            { "name": "hasa", "value": 217 }
          ],
          "derecho": [
            { "name": "aasa", "value": 106 },
            { "name": "pasa", "value": -104 },
            { "name": "hasa", "value": 210 }
          ]
        },
        {
          "name": "Ecuatorial",
          "path": "/placeholder.svg?height=300&width=400",
          "izquierdo": [
            { "name": "aasa", "value": 97 },
            { "name": "pasa", "value": -105 },
            { "name": "hasa", "value": 202 }
          ],
          "derecho": [
            { "name": "aasa", "value": 91 },
            { "name": "pasa", "value": -101 },
            { "name": "hasa", "value": 192 }
          ]
        }
      ]
    },
    {
      "name": "Centro Borde Lateral",
      "angulos": [
        {
          "name": "",
          "path": "/placeholder.svg?height=300&width=400",
          "izquierdo": [
            { "name": "cbl", "value": 60 }
          ],
          "derecho": [
            { "name": "cbl", "value": 54 }
          ]
        }
      ]
    }
  ]
}

export default function MedicalReport() {
  return (
    <div className="container mx-auto p-4 bg-white">
      <Card className="mb-6">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>{reportData.name}</CardTitle>
          <p className="text-sm text-blue-100">
            Created on: {format(new Date(reportData.createdDate), "MMMM d, yyyy HH:mm:ss")}
          </p>
        </CardHeader>
      </Card>

      {reportData.mediciones.map((medicion, index) => (
        <Card key={index} className="mb-6">
          <CardHeader className="bg-gray-100">
            <CardTitle>{medicion.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={medicion.angulos[0]?.name || "tab0"} className="w-full">
              <TabsList className="w-full justify-start bg-gray-100">
                {medicion.angulos.map((angulo, idx) => (
                  <TabsTrigger key={idx} value={angulo.name || `tab${idx}`} className="data-[state=active]:bg-white">
                    {angulo.name || `View ${idx + 1}`}
                  </TabsTrigger>
                ))}
              </TabsList>
              {medicion.angulos.map((angulo, idx) => (
                <TabsContent key={idx} value={angulo.name || `tab${idx}`} className="mt-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img src={angulo.path} alt={angulo.name} className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-md" />
                    <Table className="w-full md:w-1/2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Measurement</TableHead>
                          <TableHead>Left</TableHead>
                          <TableHead>Right</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {angulo.izquierdo.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{item.name.toUpperCase()}</TableCell>
                            <TableCell>{item.value}°</TableCell>
                            <TableCell>{angulo.derecho[i]?.value}°</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}



<div class="flex flex-col md:flex-row gap-4" data-id="14"><img data-id="15" src="/placeholder.svg?height=300&amp;width=400" alt="Proximal" class="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-md"><div class="relative w-full overflow-auto"><table class="caption-bottom text-sm w-full md:w-1/2" data-id="16"><thead class="[&amp;_tr]:border-b" data-id="17"><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-id="18"><th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0" data-id="19">Measurement</th><th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0" data-id="20">Left</th><th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0" data-id="21">Right</th></tr></thead><tbody class="[&amp;_tr:last-child]:border-0" data-id="22"><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-id="23"><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium" data-id="24">AASA</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="25">121°</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="26">113°</td></tr><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-id="23"><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium" data-id="24">PASA</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="25">-121°</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="26">-123°</td></tr><tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-id="23"><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium" data-id="24">HASA</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="25">242°</td><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" data-id="26">236°</td></tr></tbody></table></div></div>
