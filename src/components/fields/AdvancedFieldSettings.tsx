
import React from 'react';
import { X } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AdvancedFieldSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: any) => void;
  fieldType: string;
  currentSettings?: any;
}

export const AdvancedFieldSettings = ({
  isOpen,
  onClose,
  onApply,
  fieldType,
  currentSettings = {}
}: AdvancedFieldSettingsProps) => {
  const [settings, setSettings] = React.useState(currentSettings);
  const [activeTab, setActiveTab] = React.useState('validation');
  
  React.useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);
  
  const handleChangeSetting = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  
  const handleApply = () => {
    onApply(settings);
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Advanced Field Settings</SheetTitle>
          <SheetDescription>
            Configure additional options for this field
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <Tabs defaultValue="validation" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="uiOptions">UI Options</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="validation" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="required">Required</Label>
                  <Switch 
                    id="required" 
                    checked={settings.required || false}
                    onCheckedChange={(checked) => handleChangeSetting('required', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Min Length</Label>
                    <Input 
                      id="minLength"
                      type="number"
                      placeholder="Minimum length"
                      value={settings.minLength || ''}
                      onChange={(e) => handleChangeSetting('minLength', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLength">Max Length</Label>
                    <Input 
                      id="maxLength"
                      type="number"
                      placeholder="Maximum length"
                      value={settings.maxLength || ''}
                      onChange={(e) => handleChangeSetting('maxLength', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pattern">Regex Pattern</Label>
                  <Input 
                    id="pattern"
                    placeholder="Regular expression pattern"
                    value={settings.pattern || ''}
                    onChange={(e) => handleChangeSetting('pattern', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Value must match this pattern
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="uiOptions" className="mt-4 space-y-4">
              {/* UI Options based on field type */}
              {['text', 'textarea', 'email', 'password', 'number'].includes(fieldType) && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="floatingLabel">Floating Label</Label>
                    <Switch 
                      id="floatingLabel" 
                      checked={settings.floatingLabel || false}
                      onCheckedChange={(checked) => handleChangeSetting('floatingLabel', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="filled">Filled Style</Label>
                    <Switch 
                      id="filled" 
                      checked={settings.filled || false}
                      onCheckedChange={(checked) => handleChangeSetting('filled', checked)}
                    />
                  </div>
                </>
              )}
              
              {fieldType === 'calendar' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showIcon">Show Icon</Label>
                    <Switch 
                      id="showIcon" 
                      checked={settings.showIcon || false}
                      onCheckedChange={(checked) => handleChangeSetting('showIcon', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inline">Inline Display</Label>
                    <Switch 
                      id="inline" 
                      checked={settings.inline || false}
                      onCheckedChange={(checked) => handleChangeSetting('inline', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showTime">Show Time</Label>
                    <Switch 
                      id="showTime" 
                      checked={settings.showTime || false}
                      onCheckedChange={(checked) => handleChangeSetting('showTime', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="range">Date Range</Label>
                    <Switch 
                      id="range" 
                      checked={settings.range || false}
                      onCheckedChange={(checked) => handleChangeSetting('range', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Input 
                      id="dateFormat"
                      placeholder="MM/dd/yyyy"
                      value={settings.dateFormat || 'MM/dd/yyyy'}
                      onChange={(e) => handleChangeSetting('dateFormat', e.target.value)}
                    />
                  </div>
                </>
              )}
              
              {['dropdown', 'treeselect', 'selectbutton'].includes(fieldType) && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="multiple">Multiple Selection</Label>
                  <Switch 
                    id="multiple" 
                    checked={settings.multiple || false}
                    onCheckedChange={(checked) => handleChangeSetting('multiple', checked)}
                  />
                </div>
              )}
              
              {fieldType === 'rating' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowCancel">Allow Cancel</Label>
                    <Switch 
                      id="allowCancel" 
                      checked={settings.allowCancel === undefined ? true : settings.allowCancel}
                      onCheckedChange={(checked) => handleChangeSetting('allowCancel', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="count">Stars Count</Label>
                    <Input 
                      id="count"
                      type="number"
                      min={1}
                      max={10}
                      placeholder="5"
                      value={settings.count || 5}
                      onChange={(e) => handleChangeSetting('count', parseInt(e.target.value || '5', 10))}
                    />
                  </div>
                </>
              )}
              
              {fieldType === 'mentionbox' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoResize">Auto Resize</Label>
                    <Switch 
                      id="autoResize" 
                      checked={settings.autoResize || false}
                      onCheckedChange={(checked) => handleChangeSetting('autoResize', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="triggers">Triggers</Label>
                    <Input 
                      id="triggers"
                      placeholder="@,#,/"
                      value={settings.triggers || '@'}
                      onChange={(e) => handleChangeSetting('triggers', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated trigger characters
                    </p>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isHidden">Hide in UI</Label>
                  <p className="text-xs text-muted-foreground">
                    Field will not be visible in the user interface
                  </p>
                </div>
                <Switch 
                  id="isHidden" 
                  checked={settings.isHidden || false}
                  onCheckedChange={(checked) => handleChangeSetting('isHidden', checked)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
